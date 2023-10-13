require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require("cors")
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('bodydata', function (req, res) { return JSON.stringify(req.body) })



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

app.get('/', (req, res, next) => {
    res.send('<h1>Phonebook</h1>')
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({})
        .then(persons => {
            const phonebookSize = persons.length
            const header = `<h1>Phonebook has info for ${phonebookSize} people</h1>`
            let date = Date()
            res.send(header + date)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.json(persons)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
                response.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (body.name === undefined || body.phonenumber === undefined) {
        return res.status(400).json({error: 'Content missing; Content must have both name and phonenumber fields.'})
    }
    
    Person.findOne({ 'name': body.name })
        .then(person => {
            if (person) {
                return res.status(400).json({
                    error: 'Name already in phonebook'
                })
            } else {
                const person = new Person({
                    name: body.name,
                    phonenumber: body.phonenumber,
                })
            
                person.save().then(savedPerson => {
                    res.json(savedPerson)
                })
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        phonenumber: body.phonenumber,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
  
// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.name, error.message, "\n\n\n\n error \n")

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })