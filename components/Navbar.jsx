import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Searchbar from './ui/Searchbar';
import Navbar2 from './Navbar2';
import Web3 from 'web3';
import Web3Modal from "web3modal"
import { Button } from './ui/button';
import { Wallet, UserCircle2, Plus, User, LifeBuoy, LogOut, Image } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog"
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';
import axios from 'axios';




const Navbar = () => {

  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState('');
  const [sign, setSign] = useState("");
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

//No use, Testing Api
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/getUsers');
      setUsers(response.data);
    } catch (error) {
      console.error('Error retrieving users:', error);
    }
  };

  let web3Modal;
  let provider;
  
  //To connect MetaMask Wallet
  async function connect() {
    web3Modal = new Web3Modal({
      network: 'testnet',
      cacheProvider: 'false'
    });
    provider = await web3Modal.connect();
    console.log("Provider : ", provider)
    const web3 = new Web3(provider);
  
     const address = await web3.eth.getAccounts();
    setAccount(address);
    // Store the address in local storage
    localStorage.setItem('address', address);
  
    getCurrentUser(address);
    console.log("currentuser",user);
    const checksummedAccount = web3.utils.toChecksumAddress(String(address).toLowerCase());
    const balance = await web3.eth.getBalance(checksummedAccount);
    const balanceInEther = web3.utils.fromWei(balance, "ether");
    setBalance(balanceInEther);
  
    const network = await web3.eth.net.getNetworkType();
  
    console.log("web3 ::: ", web3);
    console.log("Address: ", address);
    console.log("Balance in Ether: ", balanceInEther);
    console.log(network);
  
    if (network === "main") {
      setSign("ETH");
    } else if (network === "private") {
      setSign("MATIC");
    }
  }
  
//To get the current user's name by address
const getCurrentUser = async (address) => {
  console.log("outgoing",address[0]);
  try {
    const response = await axios.get('http://localhost:3001/api/currentUser', {
      params: {
        address: address[0],
      },
    });

    if (response.status === 200) {
      const currentUser = await response.data;
      setUser(currentUser);
      console.log("Current user:", currentUser);
      setConnected(true);
    } else {
      throw new Error(`Error retrieving current user: ${response.status}`);
    }
  } catch (error) {
    console.error('Error retrieving current user:', error);
  }
};

//To create a user
const createUser = async () => {
  const address = localStorage.getItem('address');
  try {
    const response = await axios.post('http://localhost:3001/api/createUser', {
      address: address,
      name: name,
      email: email
    });
    console.log("User Created: ", response.data);
  } catch (error) {
    console.log("Error Creating User", error);
    console.log("addresscheck.",address);
    console.log("namecheck.",name);
    console.log("emailcheck.",email);
    
  }
};

const handleSaveChanges = async () => {
  await createUser();
};
  
// Disconnect from the wallet provider
const disconnectWallet = async () => {
  console.log("Disconnect...")
  // await web3Modal.clearCachedProvider();
  provider = null;
  // web3Modal.clearCachedProvider();
  setUser(null);
  localStorage.removeItem('address');
  setAccount("");
};

//To format the address in the wallet tab
const formatAddress = (address) => {
  if (address && address.length > 0) {
    const visibleChars = address[0].substr(0, 7);
    return visibleChars + "...";
  }
  return '';
};

//To format the balance in the wallet tab
const formatBalance = (balance) => {
  if (balance && balance.length > 0) {
    const formattedBalance = parseFloat(balance[0]).toFixed(5).replace(/\.?0+$/, '');
    return formattedBalance;
  }
  return '';
};

const owned = () => {
  <Link href="/NFTowned" legacyBehavior passHref>
  </Link>
}

useEffect(() => {
  connect()
}, []);


  return (
    <>
      <div className="fixed top-0 z-50 w-full">
        <div className="flex p-4 bg-[#00061a] border-r-md items-center justify-between text-white hover:rounded-none-lg">
          <div className="flex items-start row-auto">
            <Link href="/">
              <div className="relative group">
                <div className="font-italic text-2xl transition-all align-text-top">
                  ARTIFY
                </div>
                <div className="hidden md:block">
                  Where Art meets Technology
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
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
              <div className="flex flex-col md:flex-row items-center justify-between ">
                <Wallet className="mr-2 hidden md:block" />
                <div className="border border-white rounded-lg p-2 mr-4 flex items-center mt-2 md:mt-0">
                  <div className="mr-2 overflow-hidden overflow-ellipsis">
                    {formatAddress(account)}
                  </div>
                  <div className="border-l border-white pl-2">
                    {formatBalance(balance)} {sign}
                  </div>
                </div>
              </div>
            )}

            <div className="mr-4">
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <UserCircle2 className="mr-2 ml-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      {connected ? (user ? user.name : "") : "No User Found"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/NFTowned" legacyBehavior passHref>
                        <a className="flex items-center">
                          <Image className="mr-2 h-4 w-4" />
                          <span>Owned NFTs</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <DialogTrigger>
                        <div className="flex">
                          <Plus className="mr-2 h-4 w-4" />
                          <span>New User</span>
                        </div>
                      </DialogTrigger>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div
                        className="flex"
                        onClick={() => {
                          disconnectWallet();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Please enter your details below to create a new user
                        account. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Username" className="text-right">
                          Username
                        </Label>
                        <Input
                          id="Username"
                          placeholder="Enter your Username"
                          className="col-span-3"
                          onChange={(event) => setName(event.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="Email" className="text-right">
                          Email
                        </Label>
                        <Input
                          id="Email"
                          placeholder="Enter your Email"
                          className="col-span-3"
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleSaveChanges}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </DropdownMenu>
              </Dialog>
            </div>
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
