export const Filter = ({ search, handleFilter }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleFilter} />
    </div>
  );
};
