import React, {useState, useEffect} from "react"
import {useForm} from "react-hook-form"
import Fundraiser from './../../contractBuilds/Fundraiser.json'
import getWeb3 from './../../utils/getWeb3.js'
import FundraiserStore from './../../contractBuilds/FundraiserStore.json'
import Card from './components/Card'


function Fundraisers() {
    const [web3, setWeb3] = useState(undefined)
    const [accounts, setAccounts] = useState([])
    const [contract, setContract] = useState([])
    const [fundraisers, setFundraisers] = useState([])

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts()
                const networkId = await web3.eth.net.getId()
                const deployedNetwork = FundraiserStore.networks[networkId]
                const contract = new web3.eth.Contract(FundraiserStore.abi, deployedNetwork && deployedNetwork.address,)

                setWeb3(web3);
                setAccounts(accounts)
                setContract(contract)
                
                const fundraisersList = await contract.methods.getAll().call()
                setFundraisers(fundraisersList)
            
            } catch (error) {
                alert(`Failed to load web3, accounts or contract`)
                console.error(error)
            }
        }

        init()
    }, [])

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