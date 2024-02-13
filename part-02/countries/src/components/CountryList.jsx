const CountryList = ({ countriesToShow }) => {
  return (
    <ul>
      {countriesToShow.map((country) => (
        <li key={country.cca3}>{country.name.common}</li>
      ))}
    </ul>
  );
};

export default CountryList;
