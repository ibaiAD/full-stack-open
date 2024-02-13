import WeatherReport from "./WeatherReport";

const CountryInfo = ({ country }) => {
  const {
    name: { common: countryName },
    capital,
    area,
    languages,
    flags,
    capitalInfo: { latlng },
  } = country;

  const [capitalName] = capital;
  const [lat, long] = latlng;

  return (
    <div>
      <h1>{countryName}</h1>
      <p>capital {capitalName}</p>
      <p>area {area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <div>
        <img src={flags.png} alt={flags.alt} />
      </div>
      <WeatherReport name={capitalName} lat={lat} long={long} />
    </div>
  );
};

export default CountryInfo;
