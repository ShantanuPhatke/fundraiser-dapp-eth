import React, { useState, useContext, useEffect } from "react"
import Fundraiser from "../../contractBuilds/Fundraiser.json"
import Card from "./components/Card"
import { Context } from "../../Context"
import Loader from "../../components/Loader"

function Fundraisers() {
  const { web3, fundraisers } = useContext(Context)

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
        _fundraiserBalance,
        _stage,
      } = response
      // console.log(response)

      let detailsObj = {
        title: _title,
        description: _description,
        goalAmount: _goalAmount,
        hostName: _hostName,
        fundraiserAddress: _fundraiserAddress,
        fundraiserBalance: _fundraiserBalance,
        stage: _stage,
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
    .filter((fundraiser) => fundraiser.stage === "0")
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

  return (
    <>
      <div className="container">
        <div className="card-grid">
          {!web3 ? (
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
              MetaMask extension required
            </a>
          ) : fundraiserCards.length === 0 ? (
            <Loader />
          ) : (
            fundraiserCards
          )}
        </div>
      </div>
    </>
  )
}

export default Fundraisers
