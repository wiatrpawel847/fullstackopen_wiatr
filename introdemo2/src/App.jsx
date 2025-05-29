import { useState, useEffect } from 'react';
import './index.css';
import axios from 'axios';

// Notification Component
const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  );
};

// Main App Component
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Handle Name Change
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  // Handle Number Change
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Handle Search Term Change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch all persons from backend
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      })
      .catch(error => {
        setErrorMessage('Failed to fetch data from server');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  }, []);

  // Handle form submission to add a new person
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const personObject = { name: newName, number: newNumber };

    // Check if person already exists, then update
    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        axios.put(`http://localhost:3001/persons/${existingPerson.id}`, { ...existingPerson, number: newNumber })
          .then(response => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : response.data));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Updated ${newName}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            setErrorMessage('Failed to update person');
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      // Add new person
      axios.post('http://localhost:3001/persons', personObject)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Added ${newName}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          setErrorMessage('Failed to add person');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  // Handle delete of a person
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      axios.delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          setSuccessMessage('Deleted person');
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch(error => {
          setErrorMessage('Failed to delete person');
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  // Filter persons based on the search term
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      
      {/* Success and Error Notification */}
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <div>
        filter shown with <input value={searchTerm} onChange={handleSearchChange} />
      </div>

      {/* Form for adding or updating a person */}
      <form onSubmit={handleFormSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
