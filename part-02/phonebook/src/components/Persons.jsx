import { PersonDetails } from "./PersonDetails";

export const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map((person) => (
        <PersonDetails key={person.name} person={person} />
      ))}
    </ul>
  );
};
