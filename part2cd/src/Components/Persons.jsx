const Persons = ({ persons, onDeletePerson }) => {
    return (
      <div>
        {persons.map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => onDeletePerson(person.id)}>delete</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default Persons;
  