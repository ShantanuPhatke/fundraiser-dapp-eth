import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import getWeb3 from './getWeb3';
import FundraiserStore from './contracts/FundraiserStore.json';
import Fundraiser from './contracts/Fundraiser.json';
import './styles/app.scss';


function App() {

  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState([]);
  const [fundraisers, setFundraisers] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FundraiserStore.networks[networkId];
        const contract = new web3.eth.Contract(FundraiserStore.abi, deployedNetwork && deployedNetwork.address,);

        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract);
        
      } catch (error) {
        alert(
          `Failed to load web3, accounts or contract`
        );
        console.error(error);
      }
    }

    init();
  }, [])

  useEffect(() => {
    const load = async () => {
      const result = await contract.methods.getAll().call();
      console.log(result);
    }
    if (typeof web3!=='undefined' && typeof accounts!=='undefined' && typeof contract!=='undefined') {
      load();
    }

  }, [contract]);


  const {register, handleSubmit, formState: { errors } } = useForm();
  const {register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm();

  const dateToBigInt = date => new Date(date).getTime()/100;

  const onCreateSubmit = async data => {
    let { goalAmount, minDonation, expiryDate, hostName, title, description, recipientAddress } = data;

    let response = await contract.methods.createFundraiser(
      parseInt(goalAmount),
      parseInt(minDonation),
      dateToBigInt(expiryDate),
      hostName.toString(),
      title.toString(),
      description.toString(),
      recipientAddress.toString(),
    ).send({from: accounts[0]});

    console.log(response);
  }

  const onDonateSubmit = async data => {
    let { contractAddress, donationAmount } = data;
    
    try {
      let fundraiser = new web3.eth.Contract(Fundraiser.abi, contractAddress,);
      let response = await fundraiser.methods.addDonation().send({from: accounts[0], value: donationAmount});
      console.log(response);
    } catch (error) {
      alert(
        `Failed to donate to fundraiser at ${contractAddress}`
      );
      console.error(error);
    }
  }

  const getAllFundraisers = async() => {
    let response = await contract.methods.getAll().call();
    setFundraisers(response);
  }

  if (typeof web3==='undefined' || typeof accounts==='undefined' || typeof contract==='undefined') {
    return <section>Loading Web3, accounts and contracts..</section>
  } else {
      return (
        <div className="app">
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

          <section>
            <h3>Get all Fundraisers</h3>
            {fundraisers!='' ? fundraisers.map(fundraiser => <p key={fundraiser}>{fundraiser}</p> ) : <p>No data</p>}
            <button onClick={getAllFundraisers} >Get</button>
          </section>

          <section>
            <form onSubmit={handleSubmit2(onDonateSubmit)}>
              <h3>Donate</h3>
              <input type="text" name="contractAddress" id="contractAddress" placeholder="contractAddress" {...register2('contractAddress', {required: true})}/>
              {errors2.contractAddress && <span>This field is required</span>}
              
              <input type="number" name="donationAmount" id="donationAmount" placeholder="donationAmount" {...register2('donationAmount', {required: true})}/>
              {errors2.donationAmount && <span>This field is required</span>}
              
              <input type="submit" value="submit"/>
            </form>
          </section>
        </div>
      );
  }

}

export default App;
