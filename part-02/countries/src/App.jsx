import axios from "axios";
import { useEffect, useState } from "react";
import DisplayInfo from "./components/DisplayInfo";

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);

  const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
  const allCountriesURL = `${baseUrl}/all`;

  useEffect(() => {
    axios.get(allCountriesURL).then(({ data }) => setCountries(data));
  }, [allCountriesURL]);

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <form>
        find countries{" "}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <DisplayInfo search={search} countriesToShow={countriesToShow} />
    </div>
  );
}

export default App;
