require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Person = require('./models/person');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/api/persons', (req, res, next) => {  // <-- dodany next
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => {
      console.error(error);
      next(error);  // <-- zmiana
    });
});

app.get('/api/info', (req, res, next) => {  // <-- dodany next
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(error => {
      console.error(error);
      next(error);  // <-- zmiana
    });
});

app.get('/api/persons/:id', (req, res, next) => {  // <-- dodany next
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.error(error);
      next(error);  // <-- zmiana
    });
});

app.post('/api/persons', (req, res, next) => {  // <-- dodany next
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  Person.findOne({ name: body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(400).json({ error: 'name must be unique' });
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person.save()
          .then(savedPerson => {
            res.json(savedPerson);
          })
          .catch(error => {
            console.error(error);
            next(error);  // <-- zmiana
          });
      }
    })
    .catch(error => next(error)); // <-- obsługa błędu z findOne
});

app.delete('/api/persons/:id', (req, res, next) => {  // <-- dodany next
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if(result){
        res.status(204).end();
      }
      else{
        console.warn('Person not found with id: ', req.params.id);
        res.status(404).send({error: 'Person not found'});
      }
    })
    .catch(error => {
      console.error('Delete failed:', error.message);
      next(error);  // <-- zmiana
    });
});

// Middleware obsługi nieznanego endpointu (opcjonalnie, ale warto dodać)
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
});

// Middleware obsługi błędów — to jest kluczowa zmiana
app.use((error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } 
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  res.status(500).send({ error: 'server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
