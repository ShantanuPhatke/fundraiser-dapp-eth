import React, { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Fundraiser from "../../contractBuilds/Fundraiser.json"
import { Context } from "../../Context"
import { useForm } from "react-hook-form"

function Donate() {
  const { web3, accounts, contract, fundraisers } = useContext(Context)
  const [fundraiserDetails, setFundraiserDetails] = useState({})
  const { fundraiserAddress } = useParams()

  const getFundraiserDetails = async (_address) => {
    let fundraiser = new web3.eth.Contract(Fundraiser.abi, _address)
    let response = await fundraiser.methods.getAllDetails().call()

    const {
      _goalAmount,
      _minDonation,
      _donatorCount,
      _expiryDate,
      _isCompleted,
      _hostName,
      _title,
      _description,
      _hostAddress,
      _recipientAddress,
      _fundraiserAddress,
      _fundraiserBalance,
    } = response

    let detailsObj = {
      title: _title,
      description: _description,
      goalAmount: _goalAmount,
      minDonation: _minDonation,
      donatorCount: _donatorCount - 1,
      expiryDate: _expiryDate,
      isCompleted: _isCompleted,
      hostName: _hostName,
      hostAddress: _hostAddress,
      recipientAddress: _recipientAddress,
      fundraiserAddress: _fundraiserAddress,
      fundraiserBalance: _fundraiserBalance,
    }

    return detailsObj
  }

  useEffect(() => {
    if (!fundraiserAddress.startsWith("0x") || !web3) return

    getFundraiserDetails(fundraiserAddress).then((res) =>
      setFundraiserDetails(res)
    )
  }, [web3, fundraiserAddress])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onDonateSubmit = async (data) => {
    let { donationAmount } = data
    console.log(donationAmount)

    try {
      let fundraiser = new web3.eth.Contract(Fundraiser.abi, fundraiserAddress)
      let response = await fundraiser.methods
        .addDonation()
        .send({ from: accounts[0], value: donationAmount })
      console.log(response)
    } catch (error) {
      alert(`Failed to donate to fundraiser at ${fundraiserAddress}`)
      console.error(error)
    }
  }

  if (!fundraiserAddress.startsWith("0x")) {
    return <div>Invalid Address</div>
  } else {
    return (
      <div className="container">
        {/* <pre>{JSON.stringify(fundraiserDetails, null, 2)}</pre> */}
        <div className="donate-card">
          <div className="left">
            <div className="title">{fundraiserDetails.title}</div>
            <div className="description">{fundraiserDetails.description}</div>
            <div className="contributors">
              {fundraiserDetails.donatorCount === 0
                ? "Be the first one to donate!"
                : fundraiserDetails.donatorCount === 1
                ? `${fundraiserDetails.fundraiserBalance} ETH raised by a generous human!`
                : `${fundraiserDetails.fundraiserBalance} ETH raised by ${fundraiserDetails.donatorCount} generous humans!`}
              <span>❤</span>
            </div>
          </div>
          <div className="right">
            <div className="top">
              <div className="host">
                Hosted by{" "}
                <span>
                  <Link to={`/track/${fundraiserDetails.hostAddress}`}>
                    {fundraiserDetails.hostName}
                  </Link>
                </span>
              </div>
              <div className="recipient">
                Beneficiary: {fundraiserDetails.recipientAddress}
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleSubmit(onDonateSubmit)}>
                <div className="notes">
                  <div className="minDonation">
                    Minimum donation:
                    <span> {fundraiserDetails.minDonation} Wei</span>
                  </div>
                  <div className="expiryDate">
                    Expires on:<span>{fundraiserDetails.expiryDate}</span>
                  </div>
                </div>
                <input
                  type="number"
                  name="donationAmount"
                  id="donationAmount"
                  className="donationAmount"
                  placeholder="Donation amount in Wei"
                  {...register("donationAmount", { required: true })}
                />
                {errors.donationAmount && <span>This field is required</span>}

                <input type="submit" className="submit" value="DONATE" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Donate
