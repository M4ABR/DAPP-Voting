import React, { useState, useCallback, useContext, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/router";

// Internal Imports
import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoter.module.css";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import images from "../assets";

const AllowedVoters = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { setCandidate, uploadToIPFSCandidate, candidateArray, getNewCandidate, } = useContext(VotingContext);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.ethereum) {
      alert("Please install MetaMask to use this app");
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      const ipfsUrl = await uploadToIPFSCandidate(selectedFile);
      if (ipfsUrl) {
        setFileUrl(ipfsUrl);
        console.log("IPFS Link:", ipfsUrl);
      }
    },
    [uploadToIPFSCandidate]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxSize: 5000000,
  });
  useEffect(()=>{
    getNewCandidate();
    console.log(candidateArray);
  },[])

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl ? (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>{candidateForm.name}</span>
              </p>
              <p>
                Address: <span>{candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                Position: <span>{candidateForm.position}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate for Voting</h4>
              <p>Blockchain Voting Organization, Powered by Ethereum</p>
              <p className={Style.sideInfo_para}>Contract Candidate</p>
            </div>
            <div className={Style.card}>
              {candidateArray.map((el, i) => (
                <div key={i + 1} className={Style.card_box}>
                  <div className={Style.image}>
                    <img src={el[3]} alt="Profile photo" />
                  </div>
                  <div className={Style.card_info}>
                    <p>{el[1]} #{el[2].toNumber()}</p>
                    <p>{el[0]}</p>
                    <p>Address: {el[6].slice(0,10)}..</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter__container}>
          <h1>Create New Candidate</h1>
          <div className={Style.voter__container__box}>
            <div className={Style.voter__container__box__div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter__container__box__div__info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 5MB</p>
                  <div className={Style.voter__container__box__div__image}>
                    <Image
                      src={images.upload}
                      width={150}
                      height={150}
                      style={{ objectFit: "contain" }}
                      alt="File Upload"
                    />
                  </div>
                  <p>Drag & Drop or Browse Media</p>
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
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Wallet Address"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Candidate Role"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, position: e.target.value })
            }
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorize Candidate"
              handleClick={() => setCandidate(candidateForm, fileUrl)}
            />
          </div>
        </div>
      </div>

      <div className={Style.createdVoter}>
        <div className={Style.createdVoter__info}>
          <Image src={images.creator} alt="User Profile" />
          <p>Notice For User</p>
          <p>
            Organizer <span>0x9934...998</span>
          </p>
          <p>
            Only the Organizer of the Voting contract can create Voting election
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllowedVoters;
