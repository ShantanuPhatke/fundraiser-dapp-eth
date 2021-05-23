import React from "react"

function TxnLoader() {
  return (
    <div className="txnLoader">
      <div className="loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
      <p>
        Processing transactions on blockchain takes time.. Please be patient
      </p>
    </div>
  )
}

export default TxnLoader
