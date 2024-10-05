import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import MintComponent from './mintCtrl.page';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useIsMounted } from './useIsMounted';
import RestrictedPage from './restricted-page';
import { IsHolder } from './readContract';

function Wallet() {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const heldAmount = IsHolder(address);
  const [isHolder, setIsHolder] = useState(false);

  // Effect to load stored state from localStorage on mount
  useEffect(() => {
    const storedIsConnected = localStorage.getItem('isConnected');
    const storedIsHolder = localStorage.getItem('isHolder');
    
    if (storedIsConnected === 'true') {
      setIsConnected(true);
    }
    
    if (storedIsHolder === 'true') {
      setIsHolder(true);
    }
  }, []); // Run only on initial render

  // Effect for updating isConnected state
  useEffect(() => {
    if (address) {
      setIsConnected(true);
      localStorage.setItem('isConnected', 'true');
    } else {
      setIsConnected(false);
      localStorage.removeItem('isConnected');
    }
  }, [address]);

  // Effect for checking holder status when wallet is connected
  useEffect(() => {
    let heldCount = 0;
    if (heldAmount) {
      heldCount = parseInt(heldAmount.toString());
    }
    const isHolderStatus = heldCount > 0;
    setIsHolder(isHolderStatus);
    localStorage.setItem('isHolder', isHolderStatus.toString());
  }, [heldAmount]); // Dependency array includes heldAmount

  return (
    <div className={styles.web3Container}>
      <div className={styles.topLogoContainer}>
        <a className={styles.topLogoContainer} href={"https://testnets.opensea.io/collection/fortunates"} target="_blank" rel="noopener noreferrer">
          <Image src="/topLogo.png" alt="Logo" className={styles.topLogo} width={300} height={300} />
        </a>
      </div>

      <div
        className={`${styles.rainbowContainer} ${
          isConnected ? styles.connected : styles.disconnected
        }`}
      >
        <ConnectButton label="" accountStatus="" chainStatus="none" showBalance={false} />
      </div>
      <MintComponent />
      {mounted ? isHolder && <RestrictedPage /> : null}
    </div>
  );
}

export default Wallet;
