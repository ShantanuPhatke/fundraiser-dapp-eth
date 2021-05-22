import React, { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Fundraiser from "../../contractBuilds/Fundraiser.json"
import { Context } from "../../Context"
import { useForm } from "react-hook-form"

function Donate() {
  const { web3, accounts } = useContext(Context)
  const [fundraiserDetails, setFundraiserDetails] = useState({})
  const { fundraiserAddress } = useParams()

  const heart = <span>❤</span>

  const toDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`
  }

  useEffect(() => {
    if (!fundraiserAddress.startsWith("0x") || !web3) return

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
        goalAmount: web3.utils.fromWei(_goalAmount.toString(), "ether"),
        minDonation: _minDonation,
        donatorCount: _donatorCount - 1,
        expiryDate: _expiryDate,
        isCompleted: _isCompleted,
        hostName: _hostName,
        hostAddress: _hostAddress,
        recipientAddress: _recipientAddress,
        fundraiserAddress: _fundraiserAddress,
        fundraiserBalance: web3.utils.fromWei(
          _fundraiserBalance.toString(),
          "ether"
        ),
      }

      return detailsObj
    }

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

  const donationMessage = () => {
    switch (fundraiserDetails.donatorCount) {
      case 0:
        return "Be the first one to donate!"
      case 1:
        return `${fundraiserDetails.fundraiserBalance} ETH raised by a generous human!`
      default:
        break
    }
    return `${fundraiserDetails.fundraiserBalance} ETH raised by ${fundraiserDetails.donatorCount} generous humans!`
  }

  if (!fundraiserAddress.startsWith("0x")) {
    return (
      <div className="container">
        <h1>Invalid Address</h1>
      </div>
    )
  } else {
    return (
      <div className="container">
        <div className="donate-card">
          <div className="left">
            <div className="title">{fundraiserDetails.title}</div>
            <div className="description">{fundraiserDetails.description}</div>
            <div className="donators">
              {donationMessage()} {heart}
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
                Beneficiary:{" "}
                <Link to={`/track/${fundraiserDetails.recipientAddress}`}>
                  {fundraiserDetails.recipientAddress}
                </Link>
              </div>
            </div>
            <div className="bottom">
              <form onSubmit={handleSubmit(onDonateSubmit)}>
                <div className="notes">
                  <div className="goalAmount">
                    Goal amount:
                    <span> {fundraiserDetails.goalAmount} ETH</span>
                  </div>
                  <div className="minDonation">
                    Minimum donation:
                    <span> {fundraiserDetails.minDonation} Wei</span>
                  </div>
                  <div className="expiryDate">
                    Expires on:
                    <span> {toDate(fundraiserDetails.expiryDate)}</span>
                  </div>
                </div>
                <input
                  type="number"
                  name="donationAmount"
                  id="donationAmount"
                  className="donationAmount"
                  placeholder="Donation amount (Wei)"
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
