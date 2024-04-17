
const Persons = ({persons, onDeletePerson}) => {
    return (
        <ul>
            {persons.map(person => 
                <li key={person.id}>{person.name} {person.number}
                    <button value={person.id} onClick={onDeletePerson} >delete</button>
                </li>
            )
            }
        </ul>
    )
}

export default Persons