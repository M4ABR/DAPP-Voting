import React, { useContext } from "react";
import Image from "next/image"; // Can be used for displaying images
import Countdown from "react-countdown"; // Can be used for countdown functionality


///INTERNAL IMPORTS

import image from '../assets/candidate-1.jpg'; // If you plan to use the image later
import Card from '../components/card/card'; // If you plan to use the Card component later
import Style from '../styles/index.module.css'; // Your styles, if you want to use them
import { VotingContext } from "../context/Voter";

const index = () => {
  const { votingTitle } = useContext(VotingContext); // Corrected destructuring
  return <div>{votingTitle}</div>
};

export default index;
