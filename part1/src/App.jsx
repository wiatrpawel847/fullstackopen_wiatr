import { useState } from 'react'

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>
}


const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}


const Statistics = ({ good, neutral, bad, total, average, positive }) => {
  if (total === 0) {
    return <p>No feedback given</p> 
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive + " %"} />
        </tbody>
      </table>
    </div>
  )
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const goodClick = () => setGood(good + 1)
  const neutralClick = () => setNeutral(neutral + 1)
  const badClick = () => setBad(bad + 1)

  const total = good + neutral + bad
  const average = total > 0 ? (good * 1 + neutral * 0 + bad * -1) / total : 0
  const positive = total > 0 ? (good / total) * 100 : 0

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={goodClick} />
      <Button text="neutral" onClick={neutralClick} />
      <Button text="bad" onClick={badClick} />

      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
        positive={positive}
      />
    </div>
  )
}

export default App
