import { useState, useEffect } from 'react';
import personService from './personService';
import Filter from './Components/Filter';
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleAddPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    personService.create(newPerson).then((response) => {
      setPersons(persons.concat(response.data)); // Dodanie nowej osoby do listy
      setNewName('');
      setNewNumber('');
    });
  };

  const handleDeletePerson = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    const confirmDeletion = window.confirm(`Czy na pewno chcesz usunąć ${personToDelete.name}?`);

    if (confirmDeletion) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id)); // Usunięcie osoby po potwierdzeniu
      });
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} onFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        onAddPerson={handleAddPerson}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} onDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
