import React, { useState, useEffect } from "react"
import getWeb3 from './utils/getWeb3.js'
import FundraiserStore from './contractBuilds/FundraiserStore.json'

const Context = React.createContext()

function ContextProvider({children}) {
    
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
                
                // const fundraisersList = await contract.methods.getAll().call()
                // setFundraisers(fundraisersList)
            
            } catch (error) {
                alert(`Failed to load web3, accounts or contract`)
                console.error(error)
            }
        }

        init()
    }, [])

    return (
        <Context.Provider value={{web3, accounts, contract}}>
            {children}
        </Context.Provider>
    )
}

export {ContextProvider, Context}