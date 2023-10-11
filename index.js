const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('bodydata', function (req, res) { return JSON.stringify(req.body) })

/* METHOD 1 of Task 3.8
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.bodydata(req, res)
    ].join(' ')
  }))
*/

// METHOD 2 of Task 3.8
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodydata'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
    const phonebookSize = persons.length
    const header = `<h1>Phonebook has info for ${phonebookSize} people</h1>`
    let date = Date()
    res.send(header + date)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Content missing; Content must have both name and number fields.'
        })
    }
    
    const alreadyExists = persons.find(person => person.name === body.name)
    if (alreadyExists) {
        return res.status(400).json({
            error: 'Name already in phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    res.json(person)
})

const generateId = () => {
    const newId = Math.floor(Math.random()*1000000000)
    return newId
  }

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })