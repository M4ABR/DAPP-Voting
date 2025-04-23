import React, { useContext } from "react";
import Image from "next/image"; // Can be used for displaying images
import Countdown from "react-countdown"; // Can be used for countdown functionality
import { useEffect } from 'react';



///INTERNAL IMPORTS

import image from '../assets/candidate-1.jpg'; // If you plan to use the image later
import Card from '../components/card/card'; // If you plan to use the Card component later
import Style from '../styles/index.module.css'; // Your styles, if you want to use them
import { VotingContext } from "../context/Voter";

const index = () => {
  const
    { getNewCandidate,
      candidateArray,
      giveVote,
      checkIfWalletIsConnected,
      candidateLength,
      currentAccount,
      voterLength,
      getAllVoterData,
    } = useContext(VotingContext); // Corrected destructuring
  useEffect(() => {
    getAllVoterData();
    checkIfWalletIsConnected();
  },[])

  return (
    <div className={Style.home}>
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                No Candidate: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                No Voter: <span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now()+1000000000}/>
            </small>
            </div>
        </div>
      )}
      <Card candidateArray={candidateArray} giveVote={giveVote}/>
    </div>
  )

};

export default index;
