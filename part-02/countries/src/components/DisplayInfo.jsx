import CountryInfo from "./CountryInfo";
import CountryList from "./CountryList";

const DisplayInfo = ({ search, countriesToShow }) => {
  if (!search) return;
  if (countriesToShow.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }
  if (countriesToShow.length > 1) {
    return <CountryList countriesToShow={countriesToShow} />;
  }
  if (countriesToShow.length === 0) {
    return <p>No matches</p>;
  }

  const country = countriesToShow[0];

  return <CountryInfo country={country} />;
};

export default DisplayInfo;
