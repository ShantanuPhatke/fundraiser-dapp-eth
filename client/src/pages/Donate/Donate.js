import React, { useContext, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Fundraiser from "../../contractBuilds/Fundraiser.json"
import { Context } from "../../Context"
import { useForm } from "react-hook-form"
import Loader from "../../components/Loader"
import TxnLoader from "../../components/TxnLoader"

function Donate() {
  const { web3, accounts } = useContext(Context)
  const [fundraiserDetails, setFundraiserDetails] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isTxnLoading, setIsTxnLoading] = useState(false)
  let { fundraiserAddress } = useParams()

  const heart = <span>❤</span>

  const toDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        donationAmount: "",
      })
    }
  }, [isSubmitSuccessful, reset])

  useEffect(() => {
    setIsLoading(true)
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

    getFundraiserDetails(fundraiserAddress).then((res) => {
      setFundraiserDetails(res)
      setIsLoading(false)
    })
  }, [web3, fundraiserAddress, isSubmitSuccessful])

  useEffect(() => {}, [fundraiserDetails])

  const onDonateSubmit = async (data) => {
    setIsTxnLoading(true)
    let { donationAmount } = data

    try {
      let fundraiser = new web3.eth.Contract(Fundraiser.abi, fundraiserAddress)
      await fundraiser.methods
        .addDonation()
        .send({ from: accounts[0], value: donationAmount })
      // console.log(response)
      alert("Transaction successful!")
    } catch (error) {
      alert(`Failed to donate to fundraiser at ${fundraiserAddress}`)
      console.error(error)
    }
    setIsTxnLoading(false)
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
      <>
        {isTxnLoading ? <TxnLoader /> : ""}
        <div className="container">
          <div className="donate-card">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <div className="left">
                  <div className="title">{fundraiserDetails.title}</div>
                  <div className="description">
                    {fundraiserDetails.description}
                  </div>
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
                      {errors.donationAmount && (
                        <span>This field is required</span>
                      )}

                      <input type="submit" className="submit" value="DONATE" />
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Donate
