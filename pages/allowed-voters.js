import React, { useState, useEffect, useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

// Internal Imports
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import images from "../assets";
import { ST } from "next/dist/shared/lib/utils";

const allowedVoters = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter, voterArray, getAllVoterData } = useContext(VotingContext);

  // Handle file drop and upload to IPFS
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Upload to IPFS
    const ipfsUrl = await uploadToIPFS(selectedFile);
    if (ipfsUrl) {
      setFileUrl(ipfsUrl);
      console.log("IPFS Link:", ipfsUrl); // Log IPFS link to console
    }
  }, [uploadToIPFS]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });
 useEffect(()=>{
getAllVoterData();
 },[])
  
  //-------JSX PART--------//
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>{formInput.name}</span>
              </p>
              <p>
                Address: <span>{formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Position: <span>{formInput.position}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate for Voting</h4>
              <p>Blockchain Voting Organization, Provide Ethereum ecosystem</p>
              <p className={Style.sideInfo_para}>Contract Candidate</p>
            </div>
            <div className={Style.card}>
              {voterArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[4]} alt="Profile photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>{el[1]}</p>
                    <p>Address: {el[3].slice(0,10)}..</p>
                    {/* <p>Details</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Voter</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className={Style.voter__container__box__div__info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>

                  <div className={Style.voter__container__box__div__image}>
                    <Image
                      src={images.upload}
                      width={150}
                      height={150}
                      objectFit="contain"
                      alt="File Upload"
                    />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>Or Browse Media on your Device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input__container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Voter Name"
            handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) => setFormInput({ ...formInput, address: e.target.value })}
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Position"
            handleClick={(e) => setFormInput({ ...formInput, position: e.target.value })}
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorize Voter"
              handleClick={() => createVoter(formInput, fileUrl)}
            />
          </div>
        </div>
      </div>

      {/* {///////////////////} */}
      <div className={Style.createdVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={images.creator} alt="User Profile"/>
          <p>Notice For User</p>
          <p>
            Organizer <span>0x9934998....</span>
          </p>
          <p>
            Only the Organizer of the Voting contract can create Voting election
          </p>
        </div> 
      </div>

    </div>
  );
};

export default allowedVoters;
