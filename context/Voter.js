import React, { useState, useEffect } from 'react';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';
import axios from 'axios';
import { useRouter } from 'next/router';

// Replace with your actual deployed contract address and ABI
import { VotingAddress, VotingAddressABI } from './constants';
import { id } from 'ethers/lib/utils';

// Pinata Keys
const pinata_api_key = '48d571e933c3be369902';
const pinata_secret_api_key = 'b58ddd334abb6c87031548949cad333cffffa2e373308aa9898a73f7bbb181d5';

// Fetch contract
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

// Context
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
    if (!window.ethereum) return setError("Please Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) setCurrentAccount(accounts[0]);
    else setError("Please connect MetaMask");
  };

  ///--------CONNECT WALLET-------//

  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(accounts[0]);
  };

  ///----UPLOAD TO IPFS VOTER IMAGE----//

  const uploadToIPFS = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            pinata_api_key,
            pinata_secret_api_key,
            "Content-Type": "multipart/form-data",
          },
        });

        return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      } catch (err) {
        console.error("IPFS Upload Error", err);
        setError("IPFS Upload Failed");
      }
    }
  };

  ///----UPLOAD TO IPFS candidate IMAGE----//
  const uploadToIPFSCandidate = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          headers: {
            pinata_api_key,
            pinata_secret_api_key,
            "Content-Type": "multipart/form-data",
          },
        });

        return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      } catch (err) {
        console.error("IPFS Upload Error", err);
        setError("IPFS Upload Failed");
      }
    }
  };


  const createVoter = async (formInput, fileUrl) => {
    try {
      const { name, address, position } = formInput;

      // Form validation
      if (!name || !address || !position) {
        setError("All fields are required");
        return console.log("Incomplete voter input");
      }

      // Ethereum address validation
      if (!ethers.utils.isAddress(address)) {
        setError("Invalid Ethereum address");
        return console.log("Invalid Ethereum address:", address);
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // Upload metadata to IPFS
      const jsonData = JSON.stringify({ name, address, position, image: fileUrl });
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
        headers: {
          pinata_api_key,
          pinata_secret_api_key,
          "Content-Type": "application/json",
        },
      });

      const ipfsJsonUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log("Voter JSON uploaded:", ipfsJsonUrl);

      // Smart contract interaction
      const voterTx = await contract.voterRight(address, name, ipfsJsonUrl, fileUrl);
      await voterTx.wait();
      console.log("Transaction confirmed:", voterTx);

      router.push("/voterList");
    } catch (err) {
      console.error("Error creating voter:", err);
      setError(err.message || "Error in createVoter");
    }
  };

  ///-------GET VOTER DATA---///
  const getAllVoterData = async () => {

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      ///------VOTER LIST
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterdata(el);
        pushVoter.push(singleVoterData)
        // console.log(singleVoterData);
      });

      //--VOTER LENGTH-----//
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber())
    }
    catch (error) {
      setError("Something is wrong in fetchin data");
    }
  };
  //   useEffect(()=>{
  // getAllVoterData();
  //   },[]);

  //--------------GIVE VOTE------------------//
  const giveVote = async (id) => {
    try {
      const voterAddress=id.address;
      const voterId=id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList=await contract.vote(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      console.log(error)
    }
  };

  //---------------------------CANDIDATE SECTION-------------------///
  const setCandidate = async (candidateForm, fileUrl) => {
    try {
      const { name, address, position } = candidateForm;

      if (!name || !address || !position) {
        setError("All fields are required");
        return console.log("Incomplete candidate input");
      }

      if (!ethers.utils.isAddress(address)) {
        setError("Invalid Ethereum address");
        return console.log("Invalid Ethereum address:", address);
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const jsonData = JSON.stringify({
        name,
        address,
        image: fileUrl,
        position,
      });

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        jsonData,
        {
          headers: {
            pinata_api_key,
            pinata_secret_api_key,
            "Content-Type": "application/json",
          },
        }
      );

      const ipfsJsonUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
      console.log("Candidate metadata uploaded:", ipfsJsonUrl);

      const tx = await contract.setCandidate(address, position, name, fileUrl, ipfsJsonUrl);
      await tx.wait();
      console.log("Candidate added!", tx);

      router.push("/");
    } catch (err) {
      console.error("Error creating Candidate:", err);
      setError(err.message || "Error in createCandidate");
    }
  };

  //--------GET CANDIDSTE DATA----//
  const getNewCandidate = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      //-------All Candidate
      const allcandidate = await contract.getCandidate();
      // console.log(allcandidate);

      allcandidate.map(async (el) => {
        const singleCandidateData = await contract.getCandidatedata(el);

        pushCandidate.push(singleCandidateData);
        candidateIndex.push(singleCandidateData[2].toNumber());
        // console.log(singleCandidateData);
      });

      //-----Candidate Length-------/
      const allcandidateLength = await contract.getCandidateLength();
      setCandidateLength(allcandidateLength.toNumber());

    } catch (error) {
      console.log(error)

    }
  }

  useEffect(() => {
    getNewCandidate();
    console.log(voterArray)
  }, []);

  return ( 
    <VotingContext.Provider
      value={{
        votingTitle,
        currentAccount,
        connectWallet,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createVoter,
        getAllVoterData,
        giveVote,
        getNewCandidate,
        uploadToIPFSCandidate,
        setCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray
      }}
    >
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
