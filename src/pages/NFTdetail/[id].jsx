import React from 'react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ethers } from "ethers";

import { Eye , Heart, ShoppingCart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contract ABIs
import nftABI from "../../../ABI/NFTabi.json";
import nftMpABI from "../../../ABI/NftMarketPlaceabi.json";

const NFTDetail = () => {

  // Contract addresses
  const nftAddress = "0x9359D0d8BA7521A2B84db19a528453C1ac89F152";
  const nftMpAddress = "0x04c6817b0bE37D988b778FF2E78C05049f49FD6c";


  const router = useRouter();
  const { id } = router.query;
  const [nft, setNft] = useState(null);
  const [newOwner, setNewOwner] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [newOffer, setNewOffer] = useState('');


  const fetchNFT = async () => {
    try {
      if (!id) {
        return; // If id is undefined, exit the function
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts/${id}`);
      const data = await response.json();
      setNft(data);
    } catch (error) {
      console.error('Error fetching NFT:', error);
    }
  };

  const updateNFTOwner = async (newOwner, id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts/${id}/owner`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newOwner }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update NFT owner');
      }
  
      const data = await response.json();
      console.log(data.message); // NFT owner updated successfully
    } catch (error) {
      console.error('Error updating NFT owner:', error);
      // Handle the error
    }
  };

  const updateNFTSoldStatus = async (id, price) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/updnft/${id}/sold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update NFT sold status');
      }
  
      const data = await response.json();
      console.log(data.message); // NFT sold status updated successfully
    } catch (error) {
      console.error('Error updating NFT sold status:', error);
      // Handle the error
    }
  };
  

  const handleTransfer = async(id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const itemId = id;
    const nftMpContract = new ethers.Contract(nftMpAddress, nftMpABI, signer);
    // const gasLimit = await nftMpContract.estimateGas.createMarketSale(itemId);
    const NFTprice = nft.price;
    console.log("Item Id :",itemId);
    const value = { value: ethers.utils.parseEther(NFTprice.toString()) };
    console.log(value);
    const load = toast.info('Please Wait', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

    try {
      const transferNFTTransaction = await nftMpContract.createMarketSale(itemId, value);
      const receipt = await transferNFTTransaction.wait();
      console.log("NFT transferred successfully");
      console.log("Transaction hash:", receipt.transactionHash);
  
      // Only run the updateNFTOwner if the transaction is successful
      console.log("New Owner: ",newOwner);
      await updateNFTOwner(newOwner, id);
      await toast.update(load, {
        render: 'Success',
        type: 'success',
        isLoading: false,
      });
      await toast.success('NFT Bought Successfully ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        await fetchNFT()
    } catch (error) {
      console.error("Error transferring NFT:", error);
      toast.error('Error Buying NFT, Please Try Again Later', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      // Handle the error
    }
  }

  const handleResell = async(id, price) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const itemId = id;
    const nftMpContract = new ethers.Contract(nftMpAddress, nftMpABI, signer);
    console.log("Item Id :",itemId);
    // const value = {value: ethers.utils.parseEther('1.00193948')}
    // console.log(value);
    try {
      const RelistNFTTransaction = await nftMpContract.relistMarketItem(itemId, price);
  
      const receipt = await RelistNFTTransaction.wait();
      console.log("NFT Relisted successfully");
      console.log("Transaction hash:", receipt.transactionHash);
  
      // Only run the updateNFTSoldStatus if the transaction is successful
      await updateNFTSoldStatus(id, price);
      await toast.success('NFT Listed Again Successfully ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      await fetchNFT();
    } catch (error) {
      console.error("Error Relisting NFT:", error);
      toast.error('Error Lising NFT, Please Try Again Later', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      // Handle the error
    }
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProceed = () => {
    // Call the handleResell function with the new price
    handleResell(id, newPrice);
    // Close the dropdown after proceeding
    toggleDropdown();
  };

  const createOffer = async (nftId, buyerAddress, offerPrice) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nftId, buyerAddress, offerPrice }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to create offer');
      }
    
      const data = await response.json();
      console.log(data.message); // Offer created successfully
      await toast.success('Offer Sent Successfully ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
    } catch (error) {
      console.error('Error creating offer:', error);
      // Handle the error
    }
  };
  


  useEffect(() => {
    if (id) {
      fetchNFT();
      console.log(id);
    }
    const address = localStorage.getItem("address");
    setNewOwner(address);
    console.log("CurrentAddress", newOwner);
  }, [id]);

  if (!nft) {
    return <div>Loading...</div>;
  }


  const ethValue = 1964.82; // Current value of ETH in USD

  const views = Math.floor(Math.random() * 1000) + 1;
  const likes = Math.floor(Math.random() * 1000) + 1;
  
  const rarityPercentage = Math.floor(Math.random() * 100) + 1;
  let rarityTitle;
  if (rarityPercentage >= 51) {
    rarityTitle = "Common";
  } else if (rarityPercentage >= 26) {
    rarityTitle = "Uncommon";
  } else if (rarityPercentage >= 11) {
    rarityTitle = "Rare";
  } else if (rarityPercentage >= 6) {
    rarityTitle = "Epic";
  } else {
    rarityTitle = "Legendary";
  }

  return (
    <div className="mt-[135px] mb-[100px]">
      <div className="container mx-auto px-4 py-8">
        {/* Main content */}
        <div className="flex flex-wrap">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <img
              src={`https://crimson-instant-amphibian-770.mypinata.cloud/ipfs/${nft.hash}`}
              alt={nft.title}
              className="w-full md:w-3/4 lg:w-2/3 mx-auto rounded-md"
            />
          </div>
          {/* Details */}
          <div className="w-full md:w-1/2 md:pl-8 mx-auto px-4 py-8 text-lg">
            <h1 className="text-2xl font-bold mb-2">{nft.title}</h1>
            <h2 className="text-xl mb-4">Creator: {nft.creator}</h2>
            <p className="mb-4">Current owner: {nft.currentowner}</p>
            <p className="mb-4 flex items-center">
              <Eye className="mr-1" /> {views} Views |{" "}
              <Heart className="mx-1" /> {likes} Favorites
            </p>
            <p className="mb-4">
              Rarity: {rarityTitle} ({rarityPercentage}%)
            </p>
            <p className="mb-4">
              Price: {nft.price} ETH (
              {Math.round(ethValue * nft.price).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
              )
            </p>
            {nft.creator === newOwner ? (
              <div className="bg-green-500 text-white py-1 px-2 rounded inline-block">
                {/* A text that indicates that the NFT has been listed */}
                Created By You
              </div>
            ) : nft.currentowner === newOwner ? (
              nft.listed ? (
                <div className="bg-green-500 text-white py-1 px-2 rounded inline-block">
                  NFT Listed
                </div>
              ) : (
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center"
                    onClick={toggleDropdown}
                  >
                    <ShoppingCart className="mr-2" />
                    List NFT
                  </button>
                  {showDropdown && (
                    <div className='space-y-4'>
                      <input
                        type="text"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Enter new price"
                        className="px-4 py-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500"
                        required
                      />
                      <button 
                      onClick={handleProceed}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ml-2">Proceed</button>
                    </div>
                  )}
                </div>
              )
            ) : nft.sold ? (
              <div className="bg-red-500 text-white py-1 px-2 rounded inline-block">
                This NFT has been sold
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 w-36 rounded inline-flex items-center"
                  onClick={() => handleTransfer(id)}
                >
                  <ShoppingCart className="mr-2" />
                  Buy Now
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 w-28 rounded inline-flex items-center"
                  onClick={toggleDropdown}
                >
                  Offer Now
                </button>
                {showDropdown && (
                  <div className="flex flex-col space-y-4">
                    <input
                      type="text"
                      value={newOffer}
                      onChange={(e) => setNewOffer(e.target.value)}
                      placeholder="Enter Your Offer"
                      className="px-4 py-2 border border-gray-300 rounded-md text-base outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => createOffer(id, newOwner, newOffer)}
                      className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    >
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            )}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme="light"
            />
          </div>
        </div>
        {/* History */}
        {/* <div className="mt-8"> */}
        {/* <h2 className="text-xl font-bold mb-4">History</h2> */}
        {/* <div className="bg-white shadow-md rounded p-4"> */}
        {/* Add history content here */}
        {/* </div> */}
        {/* </div> */}
        {/* Offers */}
        {/* <div className="mt-8"> */}
        {/* <h2 className="text-xl font-bold mb-4">Offers</h2> */}
        {/* <div className="bg-white shadow-md rounded p-4"> */}
        {/* Add offers table here */}
        {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default NFTDetail;

