require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

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
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) return response.status(404).end();

  response.json(person);
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
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

  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((savedPerson) => {
    response.status(201).json(savedPerson);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const {
    params: { id },
    body: { name, number },
  } = request;

  const person = { name, number };

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      return response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, _, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
