const Course = ({ course }) => {
  const { name, parts } = course;

  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

const Header = ({ course }) => <h2>{course}</h2>;

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((acc, curr) => acc + curr.exercises, 0);

  return (
    <p>
      <strong>total of {totalExercises} exercises</strong>
    </p>
  );
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

export default App;
