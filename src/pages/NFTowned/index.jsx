import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Link from 'next/link';
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { ethers } from "ethers";
import 'react-toastify/dist/ReactToastify.css';

//Contrat ABI
import nftMpABI from "../../../ABI/NftMarketPlaceabi.json";

const NFTOwned = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storedAddress, setStoredAddress] = useState("");
  // const [offeredNfts, setOfferedNfts] = useState([]);
  const [buyeroffer, setBuyerOffer] = useState([]);

  // Contract addresses
  const nftMpAddress = "0x04c6817b0bE37D988b778FF2E78C05049f49FD6c";


  const fetchOwnedNFTs = async () => {
    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nft/ownedby/${storedAddress}`
      );
      const data = await response.json();
      setNFTs(data);
      console.log("The fetch owned nft Api is working",data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setIsLoading(false);
    }
  };

  const getOffersForNFT = async (nftId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nfts/${nftId}/offers`);
      if (!response.ok) {
        throw new Error('Failed to fetch offers for NFT');
      }
      const data = await response.json();
      setOfferedNfts(data)
      return data;
    } catch (error) {
      console.error('Error fetching offers for NFT:', error);
      // Handle the error
    }
  };

  const getOffersByBuyer = async (buyerAddress) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/nft/buyeroffers/${buyerAddress}`);
      const data = await response.json();
      
      setBuyerOffer(data);
      console.log("The offer by buyer Api is working",data);
      console.log("buyer Address from data",data[0].buyer_address);
      console.log("buyer Address from useState",buyeroffer[0].buyer_address);
      return data;
    } catch (error) {
      console.error('Error fetching offers by buyer:', error);
      // Handle the error
    }
  };

  const deleteOffer = async (buyerAddress, nftId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deloffers/${buyerAddress}/${nftId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete offer');
      }
      
      const data = await response.json();
      console.log(data.message); // Offer deleted successfully
      await toast.error('Offer Deleted Successfully', {
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
      console.error('Error deleting offer:', error);
      // Handle the error
    }
  };
  

  const getAll = async (storedAddress) => {
    await fetchOwnedNFTs()
    await getOffersByBuyer(storedAddress);
  };

  const intiate = async(id, price) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const itemId = id;
    const nftMpContract = new ethers.Contract(nftMpAddress, nftMpABI, signer);
    // const gasLimit = await nftMpContract.estimateGas.createMarketSale(itemId);
    const NFTprice = price;
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
  };

  useEffect(() => {
    const address = localStorage.getItem("address");
    setStoredAddress(address);
    console.log("CurrentAddress", storedAddress);

    // fetchOwnedNFTs();
    // getOffersByBuyer(storedAddress);
    getAll(storedAddress);
    console.log("All offers",buyeroffer);
  }, [storedAddress]);

  if (isLoading) {
    return <div className="mt-[135px] mb-[195px]">
      <div className="mt-52 flex flex-col items-center">
      <div className="text-gray-600 text-lg mb-4">
      <div>Loading...</div>
      </div>
      </div>
    </div>
  }

  if (nfts.length === 0) {
    return (
      <div className="mt-[135px] mb-[170px]">
        <div className="mt-52 flex flex-col items-center">
          <div className="text-gray-600 text-lg mb-4">
            No NFTs found. Start your NFT collection now!
          </div>
          <Link href={`/discover`}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Explore NFTs
            </button>
          </Link>
        </div>
        <div className="mt-10 ml-7">
          {buyeroffer.length > 0 &&
            buyeroffer[0]?.buyer_address === storedAddress && (
              <div>
                <h1 className="text-2xl font-semibold">Offers Sent</h1>
                <table className="border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">NFT Id</th>
                      <th className="py-2 px-4 border-b">NFT Title</th>
                      <th className="py-2 px-4 border-b">Offer Price</th>
                      <th className="py-2 px-4 border-b">Created At</th>
                      <th className="py-2 px-4 border-b">Status</th>
                      <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buyeroffer.map((val, i) => (
                      <tr key={i}>
                        <td className="py-2 px-4 border-b">{val.nftid}</td>
                        <Link href={`/NFTdetail/${val.nftid}`}>
                          <td className="py-2 px-4 border-b">{val.title}</td>
                        </Link>
                        <td className="py-2 px-4 border-b">
                          {val.offer_price}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(val.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {val.status === 0 && (
                            <span className="text-yellow-500">Pending</span>
                          )}
                          {val.status === 1 && (
                            <span className="text-green-500">Accepted</span>
                          )}
                          {val.status === 2 && (
                            <span className="text-red-700">Rejected</span>
                          )}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {val.status === 1 ? (
                            <div className="flex items-center">
                              <button
                                className="mr-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                onClick={() => intiate(val.nftid, val.offer_price)}
                              >
                                Initiate Transaction
                              </button>
                              <button className="text-red-500"
                              onClick={() => deleteOffer(val.buyer_address, val.nftid)}>
                                <X color="#c11f1f" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <button className="text-red-500">
                                <X color="#c11f1f" />
                              </button>
                            </div>
                            
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    );
      
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="mt-[135px] mb-[100px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {nfts.map((nft) => (
              <div key={nft.nftid}>
                <Card nft={nft} />
              </div>
            ))}
          </div>
          <div>
            {nfts[0].currentOwner === storedAddress && (
              <div>
                <h1>Only the owner will see the Offers</h1>
              </div>
            )}
            {/* {buyeroffer[0].buyer_address === storedAddress && (
              <div>
                Hello World
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTOwned;
