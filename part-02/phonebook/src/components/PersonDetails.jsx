export const PersonDetails = ({ person }) => {
  const { name, number } = person;

  return (
    <li>
      {name} {number}
    </li>
  );
};
