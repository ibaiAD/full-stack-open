import axios from "axios";
import { useEffect, useState } from "react";

const WeatherReport = ({ name, lat, long }) => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = import.meta.env.VITE_WEATHER_KEY;
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;

  useEffect(() => {
    axios
      .get(weatherURL)
      .then(({ data }) => setReport(data))
      .catch((err) => setError(err));
  }, [weatherURL]);

  if (error) return;
  if (!report) return <div>Loading...</div>;

  return (
    <div>
      <h2>Weather in {name}</h2>
      <p>temperature {report?.main.temp} Celsius</p>
      <div>
        <img
          src={`https://openweathermap.org/img/wn/${report?.weather[0].icon}@2x.png`}
        />
      </div>
      <p>wind {report?.wind.speed} m/s</p>
    </div>
  );
};

export default WeatherReport;
