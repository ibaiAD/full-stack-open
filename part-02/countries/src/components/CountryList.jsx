const CountryList = ({ countriesToShow, setSearch }) => {
  return (
    <ul>
      {countriesToShow.map((country) => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSearch(country.name.common)}>show</button>
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
