import { useEffect, useState } from "react";

import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { Persons } from "./components/Persons";
import personService from "./services/persons.js";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const addPerson = () => {
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const updatePerson = ({ id, name }) => {
    const updatedPerson = {
      name,
      number: newNumber,
    };

    personService
      .update(id, updatedPerson)
      .then((returnedPerson) =>
        setPersons(persons.map((p) => (p.id !== id ? p : returnedPerson))),
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const personFound = persons.find((person) => person.name === newName);

    if (!personFound) {
      addPerson();
      return;
    }

    const confirmation = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`,
    );

    if (!confirmation) return;
    updatePerson(personFound);
  };

  const handleDelete = ({ name, id }) => {
    if (!window.confirm(`Delete ${name} ?`)) return;

    personService.remove(id).then((personDeleted) => {
      const updatedPersons = persons.filter((p) => p.id !== personDeleted.id);
      setPersons(updatedPersons);
    });
  };

  const handleFilter = (e) => {
    setSearch(e.target.value);
  };

  const personsToShow =
    search !== ""
      ? persons.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase()),
      )
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleFilter={handleFilter} />

      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
