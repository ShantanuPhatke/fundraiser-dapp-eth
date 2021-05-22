import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { Context } from "../../Context"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const tomorrow = new Date(Date.now() + 86400000)
tomorrow.setHours(0, 0, 0, 0)

const formatDate = (date) => {
  let dd = date.getDate()
  let mm = date.getMonth() + 1 //January is 0 so need to add 1 to make it 1!
  let yyyy = date.getFullYear()
  if (dd < 10) {
    dd = "0" + dd
  }
  if (mm < 10) {
    mm = "0" + mm
  }

  return yyyy + "-" + mm + "-" + dd
}

function CreateFundraiser() {
  const { web3, accounts, contract, updateFundraisers } = useContext(Context)
  const toWei = (amount) => web3.utils.toWei(amount, "ether")

  const schema = yup.object().shape({
    hostName: yup.string().required().min(3),
    title: yup.string().required().min(3),
    goalAmount: yup.number().required(),
    minDonation: yup.number().required(),
    expiryDate: yup
      .date()
      .required()
      .min(tomorrow, "Expiry Date of the fundraiser should be a later date"),
    recipientAddress: yup
      .string()
      .required()
      .test("isAddress", "Enter a valid ethereum address", function (value) {
        return web3.utils.isAddress(value)
      }),
    description: yup.string().required().min(200),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const dateToBigInt = (date) => new Date(date).getTime() / 1000

  const onCreateSubmit = async (data) => {
    let {
      goalAmount,
      minDonation,
      expiryDate,
      hostName,
      title,
      description,
      recipientAddress,
    } = data

    let response = await contract.methods
      .createFundraiser(
        toWei(goalAmount),
        toWei(minDonation),
        dateToBigInt(expiryDate),
        hostName.toString(),
        title.toString(),
        description.toString(),
        recipientAddress.toString()
      )
      .send({ from: accounts[0] })

    console.log(response)
    updateFundraisers()
  }

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
          <section>
            <h1>Create Fundraiser</h1>
            <form onSubmit={handleSubmit(onCreateSubmit)}>
              <div className="grid-item">
                <input
                  type="text"
                  name="hostName"
                  id="hostName"
                  placeholder="Host Name"
                  {...register("hostName")}
                />
                {errors.hostName && <span>{errors.hostName.message}</span>}
              </div>
              <div className="grid-item">
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  {...register("title")}
                />
                {errors.title && <span>{errors.title.message}</span>}
              </div>
              <div className="grid-item">
                <input
                  type="number"
                  name="goalAmount"
                  id="goalAmount"
                  placeholder="Goal Amount (ETH)"
                  {...register("goalAmount")}
                />
                {errors.goalAmount && <span>{errors.goalAmount.message}</span>}
              </div>
              <div className="grid-item">
                <input
                  type="number"
                  name="minDonation"
                  id="minDonation"
                  placeholder="Minimum Donation (ETH)"
                  {...register("minDonation")}
                />
                {errors.minDonation && (
                  <span>{errors.minDonation.message}</span>
                )}
              </div>
              <div className="grid-item">
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  min={formatDate(tomorrow)}
                  {...register("expiryDate")}
                />
                {errors.expiryDate && <span>{errors.expiryDate.message}</span>}
              </div>

              <div className="grid-item">
                <input
                  type="text"
                  name="recipientAddress"
                  id="recipientAddress"
                  placeholder="Recipient Address"
                  {...register("recipientAddress")}
                />
                {errors.recipientAddress && (
                  <span>{errors.recipientAddress.message}</span>
                )}
              </div>

              <div className="grid-item description">
                <textarea
                  name="description"
                  id="description"
                  rows="4"
                  placeholder="Describe need for the fundraiser in detail..."
                  {...register("description")}
                ></textarea>
                {errors.description && (
                  <span>{errors.description.message}</span>
                )}
              </div>

              <div className="grid-item submit">
                <input type="submit" value="CREATE" />
              </div>
            </form>
          </section>
        </div>
      </>
    )
  }
}

export default CreateFundraiser
