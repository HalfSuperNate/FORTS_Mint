import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { _abi, _abiAddress, _listWallets, GetContractAddy } from './abiGet';
import { AdminCheck, GetNameCost, IsSubjectOwner } from './readContract';
import { useIsMounted } from './useIsMounted';
import styles from '../styles/Home.module.css';

function RestrictedPage() {
  const { address } = useAccount();
  //const isAdmin = AdminCheck(address);
  const mounted = useIsMounted();
  const _cost = GetNameCost();
  const [id, setId] = useState(null);  // ID input state
  const [name, setName] = useState('');  // Name input state
  const nativeToken = "POL"; // ETH or POL
  const _isSubjectOwner = IsSubjectOwner(id, address);
  const { writeContract } = useWriteContract();

  // Function to handle button click and log the ID and name
  const handleCheckId = () => {
    console.log(`Checked ID: ${id}`);
    console.log(`Entered Name: ${name}`);
    console.log(`Is Owner: ${_isSubjectOwner}`);
    if (id === null) {
      alert(`Error! \nToken ID is: ${id} \nTo resolve error enter the token you own and wish to name.`);
      return;
    }
    if (!_isSubjectOwner) {
      alert(`Error! \nWallet ${address} does not own token ${id} .\nTo resolve error enter the token you own and wish to name.`);
      return;
    } else {
      try {
          writeContract({
              address: GetContractAddy(),
              abi: _abi,
              functionName: 'setName',
              args: [id, name],
              value: (parseInt(_cost)).toString(),
          });
      } catch (error) {
          console.error('Error while naming subject:', error);
          alert('An error occurred while naming subject. Please try again later.');
      }
    }
  };

  // Handle name input change and enforce 50 character limit
  const handleNameChange = (e) => {
    if (e.target.value.length <= 50) {
      setName(e.target.value);
    }
  };

  return (
    <div className={styles.holderContentContainer}>
      <h1 className={styles.holderContent}>For Holders Only</h1>
      <a href={"https://amoy.polygonscan.com/token/0x4499a746c918bf036c31b7229e40f8445e14cf74?a=" + address} target="_blank" rel="noopener noreferrer">
        Click Here For Token Tracker
      </a>
      <a href={"https://testnets.opensea.io/" + address + "?search[collections][0]=fortunates"} target="_blank" rel="noopener noreferrer">
        View Tokens You Own Via OpenSea
      </a>
      <div className={styles.nameSubjectContainer}>
        {/* Display Name Subject Cost if Admin */}
        {mounted && (
          <p>Name A Token<br/>Cost: {(parseInt(_cost) / 10**18)} {nativeToken}</p>
        )}
        
        {/* Input for Token ID */}
        <input
          type="number"
          value={id !== null ? id : ''}
          onChange={(e) => setId(e.target.value ? parseInt(e.target.value) : null)}
          placeholder="Token ID"
          min={0}
        />
        
        {/* Input for Name with 50 character limit */}
        <input
          type="text"
          value={name}  // Controlled input for Name
          onChange={handleNameChange}  // Update name state with character limit
          placeholder="Enter Name (50 character max)"
          maxLength={50}  // Enforce max length at input level
        />
        
        {/* Button to trigger check */}
        <button onClick={handleCheckId}>
          Name Token {id} : {name}
        </button>
      </div>
    </div>
  );
};

export default RestrictedPage;
