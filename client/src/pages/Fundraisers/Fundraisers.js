import React, {useState, useContext, useEffect} from "react"
// import {useForm} from "react-hook-form"
import Fundraiser from '../../contractBuilds/Fundraiser.json'
import Card from './components/Card'
import {Context} from '../../Context'


function Fundraisers() {

    const {web3, accounts, contract, fundraisers} = useContext(Context)

    const [fundraiserDetails, setFundraiserDetails] = useState([])

    // const {register, handleSubmit, formState: { errors } } = useForm()

    // const onDonateSubmit = async data => {
    //     let { contractAddress, donationAmount } = data
        
    //     try {
    //       let fundraiser = new web3.eth.Contract(Fundraiser.abi, contractAddress,)
    //       let response = await fundraiser.methods.addDonation().send({from: accounts[0], value: donationAmount})
    //       console.log(response)
    //     } catch (error) {
    //       alert(
    //         `Failed to donate to fundraiser at ${contractAddress}`
    //       )
    //       console.error(error)
    //     }
    // }

    const getFundraiserDetails = async _address => {
      let fundraiser = new web3.eth.Contract(Fundraiser.abi, _address,)
      let response = await fundraiser.methods.getDetails().call()

      const {_title, _description, _goalAmount, _hostName, _hostAddress} = response

      let detailsObj = {
        "title": _title,
        "description": _description,
        "goalAmount": _goalAmount,
        "hostName": _hostName,
        "hostAddress": _hostAddress,
      }
      
      return detailsObj 
    }

    useEffect(() => {
      // Loop through all fundraisers
      for (const item in fundraisers) {
        getFundraiserDetails(fundraisers[item])
          .then(detailsObj => setFundraiserDetails(
            prevDetails => [...prevDetails, detailsObj]
          ))
      }
  }, [fundraisers])

    const fundraiserCards = fundraiserDetails.map((fundraiser, i) => {
      return (
        <Card key={i} id={fundraiser.hostAddress} title={fundraiser.title} hostName={fundraiser.hostName} goalAmount={fundraiser.goalAmount} description={fundraiser.description} />
      )
    })


    if (typeof web3==='undefined' || typeof accounts==='undefined' || typeof contract==='undefined') {
        return <section>Loading...</section>
      } else {
          return (
            <>
              <div className="container">
                <div className="card-grid">
                  {fundraiserCards.length > 0 ? fundraiserCards : <h1>No data found</h1>}
                </div>
              </div>
            </>

          )
      }
}

export default Fundraisers