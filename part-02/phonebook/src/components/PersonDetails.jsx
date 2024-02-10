export const PersonDetails = ({ person, handleDelete }) => {
  const { name, number } = person;

  return (
    <li>
      <span>
        {name} {number}
      </span>
      <button onClick={() => handleDelete(person)}>delete</button>
    </li>
  );
};
