const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
//node mongo.js <password> <name> <number>
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

//connet to the database
const url =
  `mongodb+srv://Jimmy:${password}@cluster0.3xjxr71.mongodb.net/part3phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url) 

//set schema and model
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('Person', personSchema)
// //add entries
// const person = new Person({
//     name:name,
//     number:number
// })

// person.save().then(result => {
//     console.log('person saved')
//     mongoose.connection.close()
// })

//list all entries
Person.find().then(result => {
    console.log('phonebook:')
    result.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})