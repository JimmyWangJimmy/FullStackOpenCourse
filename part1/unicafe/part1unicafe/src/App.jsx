import { useState } from 'react'

const Button = (props) => (
  <button theme="pink" onClick={props.onClick}>{props.text}</button>
)

const StatisticLine = (props) => {
  const {text, value} = props
  return (
    <tbody>
      <tr>
        <td>
          {text} 
        </td> 
        <td>
          {value}
        </td>
      </tr>
    </tbody>
  )
}

const Statistic = (props) => {
  const {good, neutral, bad} = props
  const all = good + neutral + bad
  if (all === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  const average = () => {
    if(all === 0){
      return 0
    }
    return (good - bad) / all
  }

  const positive = () => {
    if(all === 0){
      return 0
    }
    return (good / all) * 100
  } 

  return (
    <table>
      <StatisticLine text='good' value={good} />
      <StatisticLine text='neutral' value={neutral} />
      <StatisticLine text='bad' value={bad} />
      <StatisticLine text='all' value={all} />
      <StatisticLine text='average' value={average()} />
      <StatisticLine text='positive' value={positive() + '%'} />
    </table>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  
  const addNeutralMark = () => setNeutral(neutral + 1)
  const addBadMark = () => setBad(bad + 1)
  
  

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => setGood(good + 1)} text='good'/>
      <Button onClick={addNeutralMark} text='neutral'/>
      <Button onClick={addBadMark} text='bad'/>
      <h1>statistics</h1>
      
      <Statistic good={good} neutral={neutral} bad={bad} />
      
    </div>
  )
}

export default App