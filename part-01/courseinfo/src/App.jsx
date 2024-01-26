const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts, exercises }) => {
  return (
    <div>
      <Part part={parts[0]} exercises={exercises[0]} />
      <Part part={parts[1]} exercises={exercises[1]} />
      <Part part={parts[2]} exercises={exercises[2]} />
    </div>
  );
};

const Total = ({ totalExercises }) => {
  return <p>Number of exercises {totalExercises}</p>;
};

const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} />
      <Content
        parts={[part1, part2, part3]}
        exercises={[exercises1, exercises2, exercises3]}
      />
      <Total totalExercises={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

export default App;
