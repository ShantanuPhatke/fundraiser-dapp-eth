import React, {useState, useEffect} from "react"
import {useForm} from "react-hook-form";
import Fundraiser from './../../contractBuilds/Fundraiser.json';
import getWeb3 from './../../utils/getWeb3.js';
import FundraiserStore from './../../contractBuilds/FundraiserStore.json';


function Fundraisers() {
    const [web3, setWeb3] = useState(undefined)
    const [accounts, setAccounts] = useState([])
    const [contract, setContract] = useState([])
    const [fundraisers, setFundraisers] = useState([])

    useEffect(() => {
        console.log("Use effect");
        const init = async () => {
            console.log("init");
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
                    <section>
                        <h3>Fundraisers</h3>
                        {fundraisers.length > 0 ? fundraisers.map(fundraiser => <p key={fundraiser}>{fundraiser}</p> ) : <p>No data</p>}
                        {/* <button onClick={getAllFundraisers} >Get</button> */}
                    </section>

                    <section>
                        <form onSubmit={handleSubmit(onDonateSubmit)}>
                        <h3>Donate</h3>
                        <input type="text" name="contractAddress" id="contractAddress" placeholder="contractAddress" {...register('contractAddress', {required: true})}/>
                        {errors.contractAddress && <span>This field is required</span>}
                        
                        <input type="number" name="donationAmount" id="donationAmount" placeholder="donationAmount" {...register('donationAmount', {required: true})}/>
                        {errors.donationAmount && <span>This field is required</span>}
                        
                        <input type="submit" value="submit"/>
                        </form>
                    </section>
                </div>
            </>

          )
      }
}

export default Fundraisers