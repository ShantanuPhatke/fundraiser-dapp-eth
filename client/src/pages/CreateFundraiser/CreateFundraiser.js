import React, {useState, useEffect} from "react"
import {useForm} from "react-hook-form";
import getWeb3 from './../../utils/getWeb3.js';
import FundraiserStore from './../../contractBuilds/FundraiserStore.json';



function CreateFundraiser() {
    const [web3, setWeb3] = useState(undefined)
    const [accounts, setAccounts] = useState([])
    const [contract, setContract] = useState([])

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
            
            } catch (error) {
                alert(`Failed to load web3, accounts or contract`)
                console.error(error)
            }
        }

        init()
    }, [])

    const {register, handleSubmit, formState: { errors } } = useForm()

    const dateToBigInt = date => new Date(date).getTime()/100

    const onCreateSubmit = async data => {
        let { goalAmount, minDonation, expiryDate, hostName, title, description, recipientAddress } = data

        let response = await contract.methods.createFundraiser(
            parseInt(goalAmount),
            parseInt(minDonation),
            dateToBigInt(expiryDate),
            hostName.toString(),
            title.toString(),
            description.toString(),
            recipientAddress.toString(),
        ).send({from: accounts[0]})

        console.log(response)
    }

    if (typeof web3==='undefined' || typeof accounts==='undefined' || typeof contract==='undefined') {
        return <section>Loading...</section>
      } else {
          return(      
            <>
                <div className="container">
                    <section>
                        <form onSubmit={handleSubmit(onCreateSubmit)}>
                            <h3>Create Fundraiser</h3>
                            <input type="text" name="hostName" id="hostName" placeholder="hostName" {...register('hostName', {required: true})}/>
                            {errors.hostName && <span>This field is required</span>}
                            
                            <input type="text" name="title" id="title" placeholder="title" {...register('title', {required: true})}/>
                            {errors.title && <span>This field is required</span>}
                            
                            <input type="number" name="goalAmount" id="goalAmount" placeholder="goalAmount" {...register('goalAmount', {required: true})}/>
                            {errors.goalAmount && <span>This field is required</span>}
                            
                            <input type="number" name="minDonation" id="minDonation" placeholder="minDonation" {...register('minDonation', {required: true})}/>
                            {errors.minDonation && <span>This field is required</span>}
                            
                            <input type="date" name="expiryDate" id="expiryDate"  {...register('expiryDate', {required: true})}/>
                            {errors.expiryDate && <span>This field is required</span>}
                            
                            <input type="text" name="recipientAddress" id="recipientAddress" placeholder="recipientAddress" {...register('recipientAddress', {required: true})}/>
                            {errors.recipientAddress && <span>This field is required</span>}
                            
                            <textarea name="description" id="description" cols="30" rows="10" placeholder="description"  {...register('description', {required: true})}></textarea>
                            {errors.description && <span>This field is required</span>}
                            
                            <input type="submit" value="submit"/>
                        </form>
                    </section>
                </div>
            </>
          )
      }

}

export default CreateFundraiser