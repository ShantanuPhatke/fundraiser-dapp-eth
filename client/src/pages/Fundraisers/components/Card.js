import React from "react"

const Card = (props) => {
  const { id, title, hostName, goalAmount, description } = props

  return (
    <div className="card">
      <div>
        <h2 className="title">{title}</h2>
        <h2 className="host">
          Hosted by <span>{hostName}</span>
        </h2>
      </div>
      <h2 className="goal">
        Goal amount: <span>{goalAmount} ETH</span>
      </h2>
      <p className="description">{description}</p>
      <a className="donate" href={`/donate/${id}`}>
        Donate
      </a>
    </div>
  )
}

export default Card
