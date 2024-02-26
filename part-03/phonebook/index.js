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

app.get("/info", (_, response, next) => {
  Person.countDocuments()
    .then((numberOfPeople) => {
      response.send(`
<p>Phonebook has info for ${numberOfPeople} people</p>
<p>${new Date()}</p>
      `);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (_, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) return response.status(404).end();
      return response.json(person);
    })
    .catch((error) => next(error));
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

app.post("/api/persons", postLogger, (request, response, next) => {
  const {
    body: { name, number },
  } = request;

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const {
    params: { id },
    body: { name, number },
  } = request;

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
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

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
