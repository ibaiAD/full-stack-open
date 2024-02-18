const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
morgan.token("request-body", (request) => JSON.stringify(request.body));
app.use(morgan("tiny", { skip: (request) => request.method === "POST" }));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (_, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
<p>${new Date()}</p>`,
  );
});

app.get("/api/persons", (_, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) return response.status(404).end();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const postLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :request-body",
);

app.post("/api/persons", postLogger, (request, response) => {
  const {
    body: { name, number },
  } = request;

  if (!(name && number)) {
    return response.status(400).json({ error: "required parameter missing" });
  }

  if (
    persons.some((person) => person.name.toLowerCase() === name.toLowerCase())
  ) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const randomId = Math.floor(Math.random() * (1000 - 1) + 1);

  const newPerson = {
    id: randomId,
    name: name,
    number: number,
  };

  persons = persons.concat(newPerson);

  response.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
