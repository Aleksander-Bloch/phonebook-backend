const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/info', (request, response) => {
  const receivedAt = new Date()
  const numPersons = persons.length
  response.send(
    `
    <p>Phonebook has info for ${numPersons} people</p>
    <p>${receivedAt}</p>
    `
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.sendStatus(404)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.sendStatus(204)
})

app.post('/api/persons', (request, response) => {
  const newPerson = request.body
  if (!newPerson.name) {
    return response.status(400).send({ error: 'name is missing' })
  }
  if (!newPerson.number) {
    return response.status(400).send({ error: 'number is missing' })
  }
  const existingPerson = persons.find(p => p.name === newPerson.name)
  if (existingPerson) {
    return response.status(400).send({ error: 'name must be unique' })
  }
  const MAX_ID = 1_000_000
  const newId = 1 + Math.floor(MAX_ID * Math.random())
  newPerson.id = newId
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]
