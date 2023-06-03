import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Searchbar from './ui/Searchbar';
import Navbar2 from './Navbar2';
import Web3 from 'web3';
import Web3Modal from "web3modal"
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';




const Navbar = () => {

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState('');
  const [sign, setSign] = useState("")

  
async function connect () {
  const web3modal = new Web3Modal({
    network:'testnet',
    cacheProvider:'true'
  });
  const provider = await web3modal.connect();
  console.log("Provider : ",provider)
  const web3 = new Web3(provider);
  

  const address = await web3.eth.getAccounts();
  setAccount(address);
  
  const balance = await web3.eth.getBalance("0x4ef1985f5291849BA593539b08cdA1188E137867");
  const balanceInEther = web3.utils.fromWei(balance, "ether");
  setBalance(balanceInEther);

  const network = await web3.eth.net.getNetworkType();


  console.log("web3 ::: ",web3);
  console.log("Address: ", account);
  console.log("Balance in Ether: ", balanceInEther);
  console.log(network);

  if (network == "main") {
    setSign("ETH");
  }
  else if (network == "private") {
    setSign("MATIC");
  }
}

const formatAddress = (address) => {
  if (address && address.length > 0) {
    const visibleChars = address[0].substr(0, 7);
    return visibleChars + "...";
  }
  return '';
};


// useEffect(() => {
//   connect();
// }, []);



  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className="flex p-4 bg-[#00061a] border-r-md items-center justify-between text-white hover:rounded-none-lg">
          <div className="flex items-start row-auto">
            <Link href="/">
              <div className="relative group">
                <div className="font-italic text-2xl transition-all hover:text-3xl align-text-top">
                  Artify
                </div>
                <div className=" opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  Where Art meets Technology
                </div>
              </div>
            </Link>
          </div>
          <div>
            <Searchbar />
          </div>
          <div className="flex items-center justify-between">
            {!account && (
              <Button
                onClick={() => {
                  connect();
                }}
                style={{ backgroundColor: "transparent" }}
              >
                Connect Wallet
              </Button>
            )}
            {account && (
              <div className="flex items-center justify-between">
                <Wallet className="mr-2" />
                <div className="border border-white rounded-lg p-2 mr-4 flex items-center">
                  <div className='mr-2'>{formatAddress(account)}</div>
                  <div className="border-l border-white pl-2">
                    {balance} {sign}
                  </div>
                </div>
              </div>
            )}
            <Link href="/">
              <div className="mr-4">Contact Us</div>
            </Link>
          </div>
        </div>
      </div>
      <div style={{ zIndex: 30, position: "relative" }}>
        <Navbar2 />
      </div>
    </>
  );
};

export default Navbar;
