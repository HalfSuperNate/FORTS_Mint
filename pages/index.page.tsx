import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Wallet from './wallet.page';
import Link from 'next/link';
import Image from 'next/image';

const iStyle_a = {
  left: '-35px'
}

const iStyle_b = {
  left: '35px'
}

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fortunates Mint</title>
        <meta name="description" content="Fortunates are a mix of randomly picked, generated, and fully on-chain subjects." />
        <link href="/icon.png" rel="icon" type="image/x-icon"/>
      </Head>

      <main className={styles.main}>

        <Wallet />
        
      </main>

      <div className={styles.bottomImg}>
        <Image fill src="/bottomImg.png" alt="Logo" />
      </div>
      
      <footer className={styles.footer}>
        <Link href="https://testnets.opensea.io/assets/mumbai/0x401fd2d3f0d48ac2e9e9e4ae63589c801b855eff" rel="noopener noreferrer" target="_blank">
          <div className={styles.footerLogo}>
            <Image width={30} height={30} src="/opensea_icon.svg" alt="OpenSea"/>
          </div>
        </Link>
        <Link href="https://mumbai.polygonscan.com/address/0x401fd2d3f0d48ac2e9e9e4ae63589c801b855eff" rel="noopener noreferrer" target="_blank">
          <div className={styles.footerLogo}>
            <Image width={30} height={30} src="/polygonscan.svg" alt="Etherscan"/>
          </div>
        </Link>
        <Link href="https://twitter.com/EasyNFT_" rel="noopener noreferrer" target="_blank">
          <div className={styles.footerLogo}>
            <Image width={30} height={30} src="/x_icon.svg" alt="Twitter"/>
          </div>
        </Link>
      </footer>
    </div>
  );
};

export default Home;
