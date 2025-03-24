import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers, Signer } from 'ethers';
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from 'axios';
import { useRouter } from 'next/router';

// Internal Imports
import { VotingAddress, VotingAddressABI } from './constants';

// Corrected IPFS URL
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

// Fetch contract function
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

// Voting context for sharing data between components
export const VotingContext = React.createContext();

// VotingProvider to wrap the app with the VotingContext
export const VotingProvider = ({ children }) => {
  const votingTitle = 'My first smart contract app';
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState('');
  const [candidateLength, setCandidateLength] = useState('');
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  ///////---------END OF CANDIDATE DATA---------//////

  const [error, setError] = useState('');
  const higestVote = [];

  ///////--------VOTER SECTION------//

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState('');
  const [voterAddress, setVoterAddress] = useState([]);


  //////------CONNECTING METAMASK----///

  const checkIfWalletIsConnected = async () => {

    if (!window.ethereum) return setError("Please Install Metamask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
    }
    else {
      setError("Please Install Metamask & Connect, Reload")
    }
  };

  ///--------CONNECT WALLET-------//

  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");

    const account = await window.ethereum.request({
      method: "eth_requestAccounts",

    });

    setCurrentAccount(account[0]);
  };

  ///----UPLOAD TO IPFS VOTER IMAGE----//

  const uploadToIPFS = async (file) => {
    try {
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      setError("Error Uploading to IPFS");
      return null;
    }
  };

//-------CREATE VOTER-----------//
const createVoter = async(formInput, fileUrl, router) => {
  try {
    const { name, address, position } = formInput;
    if(!name || !address ||!position)
      return console.log("input data is missing")
  
  //---CONNECTING SMART CONTRACT---//
  const web3Modal=new Web3Modal();
  const connection=await web3Modal.connect();
  const provider=new ethers.providers.Web3Provider(connection);
  const signer=provider.getSigner();
  const contract=fetchContract(signer);
  console.log(contract);
  
  const data=JSON.stringify({name, address, position, image:fileUrl});
  const added=await client.add(data);

  const url=`https://ipfs.infura.io/ipfs/${added.path}`;
  
const tx = await contract.voterRight(address, name, url, fileUrl);
await tx.wait();  // ✅ Wait for transaction confirmation
console.log("Transaction successful:", tx);
router.push("/voterList");


  } catch (error) {
    setError("Error in Creating Voter");
  }
};

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
      }}>
      {children}
    </VotingContext.Provider>
  );
};


const Voter = () => {
  return (
    <div>

    </div>
  );
};

export default Voter;
