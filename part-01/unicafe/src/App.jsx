import { useState } from "react";

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Total = ({ total }) => <p>all {total}</p>;

const Average = ({ good, neutral, bad }) => {
  const average = (good - bad) / (good + neutral + bad);

  return <p>average {!isNaN(average) && average}</p>;
};

const PositivePercentage = ({ good, neutral, bad }) => {
  const positivePercentage = (100 * good) / (good + neutral + bad);

  return (
    <p>positive {!isNaN(positivePercentage) && positivePercentage + " %"}</p>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <section>
        <h2>give feedback</h2>
        <Button handleClick={() => setGood(good + 1)} text="good" />
        <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
        <Button handleClick={() => setBad(bad + 1)} text="bad" />
      </section>

      <section>
        <h2>statistics</h2>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <Total total={good + neutral + bad} />
        <Average good={good} neutral={neutral} bad={bad} />
        <PositivePercentage good={good} neutral={neutral} bad={bad} />
      </section>
    </div>
  );
};

export default App;
