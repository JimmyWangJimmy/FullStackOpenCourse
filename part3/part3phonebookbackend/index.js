require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['content'](req, res), 'END'
    ].join(' ')
  }))

  morgan.token('content', function (req, res) { return JSON.stringify(req.body) })

/*local storage version
let persons = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
]
*/

app.get('/api/persons', (request, response) => {
    //console.log('GET /api/persons')
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    console.log('GET /info')
    return response.send(
        `Phonebook has info for ${persons.length} people
        <br/>
        ${new Date()}`
    )
})
//find by name
app.get('/api/people/:name', (request, response) => {
    const name = Number(request.params.name)
    Person.find({name: name}).then(person => {
        console.log('person:', person)
        response.json(person)
    })
  })

/* local storage version
app.get('/api/persons/:id', (request, response) => {
    console.log('GET /api/persons/:', request.params.id)
    console.log('request.params:', request.params)
    const id = Number(request.params.id)
    
    const person = persons.find(person => person.id === id)
    if (person){
        return response.send(person)
    }
    else {
        console.log('404')
        response.status(404).end()
    }
    
})
*/
//find by id
app.get('api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        } else {
            console.log(person)
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

//delete by id
app.delete('/api/persons/:id', (request, response, next) => { 
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


//add new person
app.post('/api/persons', (request, response, next) => {
   // console.log('POST /api/persons', request.body)
    const body = request.body
    if (body.name === undefined || body.number === undefined){
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
        response.json(savedPerson)
        })
        .catch(error => next(error))
    //local storage version 
    // const personnames = persons.map(person => person.name)
    // const uniqueName =personnames.includes(body.name)
    // //console.log('uniqueName:', uniqueName,'type of:', typeof uniqueName)
    // if(uniqueName){
    //     //console.log('name must be unique')
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    // const person = {...request.body, id: Math.floor(Math.random() * 1000)}
    // persons = persons.concat(person)
    // //console.log('person:', person)
    // response.json(person)
})  

//update by id
app.post('/api/persons/:id', (request, response, next) => {
     Person.findByIdAndUpdate(request.params.id, request.body, {new: true})
        .then(result => {
          response.status(204).end()
        })
        .catch(error => next(error))
})


//unknown Endpoint
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

//Error handling middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      console.log('error.name:', error.name)
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
