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

  useEffect(() => {
    // Check if address is not null or empty to determine if the wallet is connected
    setIsConnected(!!address);
  }, [address]);

  // Effect for checking holder status when wallet is connected
  useEffect(() => {
    let heldCount = 0;
    if (heldAmount) {
      heldCount = parseInt(heldAmount.toString());
    }
    setIsHolder(heldCount > 0);
  }, [isConnected]); // Dependency array changed to isConnected

  // if (address != "0x0000000000000000000000000000000000000000") {
  //   console.log(address);
  //   console.log(isConnected);
  // }

  return (
    <div className={styles.web3Container}>
      <div className={styles.topLogoContainer}>
        <Image src="/topLogo.png" alt="Logo" className={styles.topLogo} width={300} height={300}/>
      </div>

      <div
        className={`${styles.rainbowContainer} ${
          isConnected ? styles.connected : styles.disconnected
        }`}
      >
        <ConnectButton label="" accountStatus="" chainStatus="none" showBalance={false} />
      </div>
      <MintComponent />
      { mounted ? isHolder && <RestrictedPage /> : null }
    </div>
  );
}

export default Wallet;
