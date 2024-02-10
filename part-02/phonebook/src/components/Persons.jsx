import { PersonDetails } from "./PersonDetails";

export const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <PersonDetails
          key={person.name}
          person={person}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  );
};
