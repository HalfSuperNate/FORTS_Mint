import React, { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
//import { parseGwei } from 'viem';
import { useIsMounted } from './useIsMounted';
import { GetPaused, GetSupply, GetCost, AdminCheck } from './readContract';
import { _abi, _abiAddress, _listWallets, GetContractAddy } from './abiGet';
// import { MerkleTree } from 'merkletreejs';
// import { keccak256 } from 'ethers';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

// function GetProof(_address) {
//     if(!_address || !isValidEthereumAddress(_address)) return [];
//     // Convert the wallet addresses to an array of strings
//     const walletAddresses = _listWallets.map(x => keccak256(x));
//     const merkleTree = new MerkleTree(walletAddresses, keccak256, { sortPairs: true });

//     // Get the index of the wallet address you want to generate a proof for
//     const wallet = walletAddresses.find(w => w.toLowerCase() === keccak256(_address));
//     if(wallet){
//         // Generate a proof for the specified wallet;
//         const proof = merkleTree.getHexProof(wallet);
//         // Print the proof
//         console.log("Proof:", proof);
//         return proof;
//     } else {
//         console.error(`Wallet ${_address} not found in the list.`);
//         return [];
//     }
// }

// function isValidEthereumAddress(_address) {
//     // Check if the address is a non-empty string
//     if (typeof _address !== 'string' || _address.length !== 42) {
//         return false;
//     }

//     // Check if the address matches the Ethereum address pattern
//     const addressRegex = /^0x[0-9a-fA-F]{40}$/;
//     return addressRegex.test(_address);
// }

function MintComponent() {
    const { address } = useAccount();
    var isAdmin = AdminCheck(address);
    const mounted = useIsMounted();
    const [quantity, setQuantity] = useState(1);
    //const [walletAddress, setWalletAddress] = useState(address);
    //var proof = GetProof(address);
    //const isOnList = proof.length > 0;
    var _cost = GetCost();
    const _supply = GetSupply();
    //const _mintPhase = GetMintPhase();
    const _mintPhase = 2;
    const _paused = GetPaused();
    const minQty = 1;
    const maxQty = 3;
    const nativeToken = "POL"; // ETH or POL
    //const maxSupply = "Endless";ß

    const { writeContract } = useWriteContract();

    const handleDecreaseQuantity = () => {
        if (quantity > minQty) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        if (quantity < maxQty) {
            setQuantity(quantity + 1);
        }
    };

    // const handleWalletChange = (event) => {
    //     setWalletAddress(event.target.value);
    //     //proof = GetProof(event.target.value);
    //     _cost = GetCost();
    // };

    const handleMintClick = () => {
        let _isAdmin = isAdmin;
        // Perform minting logic here
        if (!address) {
            alert(`Error: Not Connected`);
            return;
        }
        if (_paused == true && !_isAdmin){
            alert(`Error: Paused`);
            return;
        }
        if (_isAdmin){
            _cost = 0;
        }
        // if (walletAddress.length !== 42) {
        //     alert(`Confirm your send to ${address} then press Mint to complete transaction.`);
        //     setWalletAddress(address);
        // } else {
            try {
                writeContract({
                    address: GetContractAddy(),
                    abi: _abi,
                    functionName: 'mint',
                    //args: [walletAddress, quantity, 0, proof],
                    args: [address, quantity],
                    value: (parseInt(_cost) * quantity).toString(), 
                    gas: BigInt(900000 * quantity),
                    //gasPrice: parseGwei('15'),
                    // maxFeePerGas: parseGwei('20'),
                    // maxPriorityFeePerGas: parseGwei('20'),
                    // overrides: {
                    //     gasLimit: 900000,
                    //     nonce: nonce || undefined,
                    // },
                }); // Call the write function
                //alert(`This would have minted ${quantity} NFTs!`);
            } catch (error) {
                console.error('Error while minting:', error);
                alert('An error occurred while minting. Please try again later.');
            }
        //}
    };

    return (
        <div className={styles.mintContainer}>
            <div className={styles.quantityControl}>
                {mounted ? _mintPhase != 0 && 
                    <Image
                        width={500}
                        height={500}
                        src="/left_arrow.png"
                        alt="Decrease Quantity"
                        onClick={handleDecreaseQuantity}
                        className={styles.arrowButton}
                        disabled={quantity === minQty}
                    /> : null
                }
                
                <Image 
                    width={500}
                    height={500}
                    src={`/${quantity}.png`}
                    alt={`Quantity: ${quantity}`}
                    className={styles.quantityImage}
                />
                {mounted ? _mintPhase != 0 && 
                    <Image 
                        width={500}
                        height={500}
                        src="/right_arrow.png"
                        alt="Increase Quantity"
                        onClick={handleIncreaseQuantity}
                        className={styles.arrowButton}
                        disabled={quantity === maxQty}
                    /> : null
                }
                
            </div>
            {/* <div className={styles.mintToControl}>
                <br></br>
                <input
                    type="text"
                    value={walletAddress}
                    onChange={handleWalletChange}
                    placeholder="Wallet Address"
                />
            </div> */}
            <div className={styles.mintCostSupply}>
                {mounted ? _paused == true && <p>Mint Currently Paused</p> : null}
                {mounted ? _mintPhase == 0 && <p>Minting Soon</p> : null}
                {mounted ? _mintPhase == 1 && <p>Whitelist Phase</p> : null}
                {mounted ? _mintPhase == 2 && <p>{((parseInt(_cost) * quantity) / 10**18)} {nativeToken}</p> : null}
                {mounted ? _supply >= 0 && <p>Supply: {parseInt(_supply)}</p> : null}
            </div>
            <div className={styles.mintButton}>
                <Image 
                    width={500}
                    height={500}
                    src="/mint.png"
                    alt="Mint Button"
                    onClick={handleMintClick}
                    className={styles.mintButton}
                />
            </div>
            
        </div>
    );
}

export default MintComponent;