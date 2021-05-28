import React from "react"

function TxnCard(props) {
  const { from, to, timeStamp, value } = props.txnDetails

  const getDate = (timestamp) => {
    const dateObj = new Date(parseInt(timestamp) * 1000)
    const date =
      dateObj.getDate() +
      "/" +
      (dateObj.getMonth() + 1) +
      "/" +
      dateObj.getFullYear()
    return date
  }

  const getTime = (timestamp) => {
    const dateObj = new Date(parseInt(timestamp))
    const time =
      dateObj.getHours() +
      ":" +
      dateObj.getMinutes() +
      ":" +
      dateObj.getSeconds()
    return time
  }

  return (
    <div className="txnCard">
      <p>
        <strong>From:</strong> {from}
      </p>
      <p>
        <strong>To:</strong> {to}
      </p>
      <p>
        <strong>Date:</strong> {getDate(timeStamp)}
      </p>
      <p>
        <strong>Time:</strong> {getTime(timeStamp)}
      </p>
      <p>
        <strong>Amount:</strong> {value} wei
      </p>
    </div>
  )
}

export default TxnCard
