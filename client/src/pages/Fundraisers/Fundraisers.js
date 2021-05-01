import React, {useState, useContext} from "react"
import {useForm} from "react-hook-form"
import Fundraiser from './../../contractBuilds/Fundraiser.json'
import getWeb3 from './../../utils/getWeb3.js'
import FundraiserStore from './../../contractBuilds/FundraiserStore.json'
import Card from './components/Card'
import {Context} from '../../Context'


function Fundraisers() {
    const [fundraisers, setFundraisers] = useState([])

    const {web3, accounts, contract} = useContext(Context)

    const {register, handleSubmit, formState: { errors } } = useForm()

    const onDonateSubmit = async data => {
        let { contractAddress, donationAmount } = data
        
        try {
          let fundraiser = new web3.eth.Contract(Fundraiser.abi, contractAddress,)
          let response = await fundraiser.methods.addDonation().send({from: accounts[0], value: donationAmount})
          console.log(response)
        } catch (error) {
          alert(
            `Failed to donate to fundraiser at ${contractAddress}`
          )
          console.error(error)
        }
    }

    const getAllFundraisers = async() => {
        let response = await contract.methods.getAll().call()
        setFundraisers(response)
    }
    if (typeof web3==='undefined' || typeof accounts==='undefined' || typeof contract==='undefined') {
        return <section>Loading...</section>
      } else {
          return (
            <>
                <div className="container">
                    
                    <Card id='01' title='Fundraiser title' hostName='shan10u' goalAmount='0.001' description='Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio, doloribus dicta numquam laborum nisi enim voluptatem facilis a ea sunt in incidunt ipsam!' />

                </div>
            </>

          )
      }
}

export default Fundraisers