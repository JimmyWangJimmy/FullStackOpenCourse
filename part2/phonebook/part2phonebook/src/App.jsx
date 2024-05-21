import { useEffect, useState } from 'react'
import personService from './services/person'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [conductMessage, setConductMessage] = useState('No conduct currently')
    
  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    //Compare if exists
    const personnames = persons.map(person => person.name)
  
    
    //console.log(personnames)
    
    //console.log(newName)
    if (personnames.includes(newName)) {
      const personID = persons.find(person => person.name === newName).id
      console.log('Name exists')
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) 
      {
        console.log('Replace')
        const personObject = {name: newName, number: newNumber}
        personService
          .update(personID, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personID ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setConductMessage(`Updated ${newName}`)
          })
          .catch(error => {
            console.log('Error', error)
            setConductMessage(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== personID))
          })
      }
      else {
        console.log('Not replace')
      }
      
    }
    else {
    const personObject = {name: newName, number: newNumber}
    console.log('personObject: ', personObject)
    personService
      .create(personObject)
      .then(returnedPerson => {
        console.log('returnedPerson: ', returnedPerson)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setConductMessage(`Added ${newName}`)
      })
      .catch(error =>{
        setConductMessage(`Person Validation Error: ${error.response.data.error}`)
        console.log(error.response.data.error)
      })
  
    }
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchNameChange = (event) => {
    //console.log(event.target.value)
    setSearchName(event.target.value)

    const find = persons.filter((person) => person.name === event.target.value)

    if (find.length > 0) {
      console.log('find ya')
      const name = find[0].name
      console.log('Name: ', name)
      const number = find[0].number
      alert(`Find name: ${name} number: ${number}`)
    }

  }

  const deletePerson = (event) => {
    const deleteId = event.target.value
    const personname = persons.find(person => person.id === deleteId).name
    console.log(deleteId)
    console.log(personname)
    

    if(window.confirm(`Delete ${personname}?`)) {
        console.log('Delete')
        personService
          .deletePerson(deleteId)
          .then(() => {
            console.log('Deleted')
            setPersons(persons.filter(person => person.id !== deleteId))
            setConductMessage(`Deleted ${personname}`)
          })
          .catch(error => console.log('Error', error))
    }
    else {
        console.log('Not delete')
    }
  
  }


  useEffect(() => { 
    //console.log('effect')
    //console.log('persons: ', persons)
    personService
      .getAll()
      .then(initialPersons => {
        console.log(initialPersons)
        setPersons(initialPersons)
        setConductMessage('Persons loaded')
      })
  },[])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={conductMessage}/>
      <Filter searchName={searchName} handleSearchNameChange={handleSearchNameChange}/>
      <h3>Add a new</h3>

      <PersonForm 
        addPerson={addPerson} 
        newName={newName} handleNameChange={handleNameChange} 
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
        
      <h3>Numbers</h3>
      <Persons persons={persons} onDeletePerson={deletePerson} />
      
    </div>
  )
}

export default App