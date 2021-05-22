import React, { useState, useContext, useEffect } from "react"
import Fundraiser from "../../contractBuilds/Fundraiser.json"
import Card from "./components/Card"
import { Context } from "../../Context"

function Fundraisers() {
  const { web3, accounts, contract, fundraisers } = useContext(Context)

  const [fundraiserDetails, setFundraiserDetails] = useState([])

  useEffect(() => {
    if (!web3) return
    const getFundraiserDetails = async (_address) => {
      let fundraiser = new web3.eth.Contract(Fundraiser.abi, _address)
      let response = await fundraiser.methods.getDetails().call()

      const {
        _title,
        _description,
        _goalAmount,
        _hostName,
        _fundraiserAddress,
        _isExpired,
        _fundraiserBalance,
      } = response
      console.log(response)

      let detailsObj = {
        title: _title,
        description: _description,
        goalAmount: _goalAmount,
        hostName: _hostName,
        fundraiserAddress: _fundraiserAddress,
        isExpired: _isExpired,
        fundraiserBalance: _fundraiserBalance,
      }

      return detailsObj
    }
    // Loop through all fundraisers
    for (const item in fundraisers) {
      getFundraiserDetails(fundraisers[item]).then((detailsObj) =>
        setFundraiserDetails((prevDetails) => [...prevDetails, detailsObj])
      )
    }
  }, [fundraisers, web3])

  const fundraiserCards = fundraiserDetails
    // .filter((fundraiser) => !fundraiser.isExpired)
    .map((fundraiser, i) => {
      // console.log(fundraiser)
      return (
        <Card
          key={i}
          id={fundraiser.fundraiserAddress}
          title={fundraiser.title}
          hostName={fundraiser.hostName}
          goalAmount={fundraiser.goalAmount}
          description={fundraiser.description}
          fundraiserBalance={fundraiser.fundraiserBalance}
        />
      )
    })

  if (
    typeof web3 === "undefined" ||
    typeof accounts === "undefined" ||
    typeof contract === "undefined"
  ) {
    return <section>Loading...</section>
  } else {
    return (
      <>
        <div className="container">
          <div className="card-grid">
            {fundraiserCards.length > 0 ? (
              fundraiserCards
            ) : (
              <h1>No data found</h1>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Fundraisers
