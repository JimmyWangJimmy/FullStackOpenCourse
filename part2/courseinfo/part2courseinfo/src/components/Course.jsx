const Header = ({name}) => {
    return ( 
      <h1>{name}</h1>
    )
  }
  const Content = ({parts}) => {
    return (
      <ul>
        {parts.map((part) => <Part key={part.id} part={part}/>)}
      </ul>
    )
    
  }
  const Part = ({part}) => {
    console.log(part)
    return (
      <li key={part.id}>{part.name} {part.exercises}</li>
    )
  }

  
const Course = ({courses}) => {
  
    return courses.map((course) => { 
      const name = course.name
      const parts = course.parts
      
      
      return (
        <div key={course.id}>
          <Header name={name}/>
          <Content parts={parts} />
          <p>total of {parts.map((ele) => ele.exercises).reduce(
              (acc, cur) => {
              return (acc + cur)
              } , 0
            )} exercises
          </p>
        </div>
      )
    })

}

export default Course