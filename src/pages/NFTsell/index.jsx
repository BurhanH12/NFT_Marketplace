import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "../../../components/ui/checkbox";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { ethers } from "ethers";


// Contract ABIs
import nftABI from "../../../ABI/NFTabi.json";
import nftMpABI from "../../../ABI/NftMarketPlaceabi.json";

// const [provider, setProvider] = useState(null)
// const [signer, setSigner] = useState(null)

//PINATA API KEYS
const JWT = `${process.env.NEXT_PUBLIC_PINATA_JWT}`;
const API_KEY = `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`;
const API_SECRET = `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`;

const NFTListing = () => {
  // Contract addresses
  const nftAddress = "0x9359D0d8BA7521A2B84db19a528453C1ac89F152";
  const nftMpAddress = "0x04c6817b0bE37D988b778FF2E78C05049f49FD6c";

  // Provider and signer
  let provider;
  let signer;
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }
  

  // Create instances of the contracts
  const nftContract = new ethers.Contract(nftAddress, nftABI, signer);
  const nftMpContract = new ethers.Contract(nftMpAddress, nftMpABI, signer);
  
  const {register,handleSubmit,formState: { errors },} = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [storedAddress, setStoredAddress] = useState("");
  const [lastId, setLastId] = useState(null);

  const [auctionEnabled, setAuctionEnabled] = useState(false);
  const [unlockableContentEnabled, setUnlockableContentEnabled] = useState(false);
  const [explicitContentEnabled, setExplicitContentEnabled] = useState(false);

  const [NFTtitle, setNFTtitle] = useState("");
  const [NFTprice, setNFTprice] = useState("");
  const [NFTdescription, setNFTdescription] = useState("");

  const handleNFTTitleChange = (event) => {
    setNFTtitle(event.target.value);
  };
  const handleNFTPriceChange = (event) => {
    setNFTprice(event.target.value);
  };
  const handleNFTdescriptionChange = (event) => {
    setNFTdescription(event.target.value);
  };

  const handleAuctionEnabledChange = (event) => {
    setAuctionEnabled(event.target.checked);
  };

  const changeHandler = (event) => {
    setImageFile(event.target.files[0]);
  };

  let ipfsHash;

  const handleSubmission = async () => {
    let metadataRes
    const formData = new FormData();
    formData.append("file", imageFile);

    const load = toast.loading("Please wait...")

    const metadata = JSON.stringify({
      name: NFTtitle,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    //Uploads Image to IPFS
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(res.data);
      ipfsHash = await res.data.IpfsHash;

      // Proceed with metadata upload after receiving the IPFS Image hash
      const data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: NFTtitle,
          keyvalues: {
            PINATA_API_KEY: API_KEY,
            PINATA_API_SECRET: API_SECRET,
          },
        },
        pinataContent: {
          name: NFTtitle,
          price: NFTprice,
          description: NFTdescription,
          ipfsHash: ipfsHash, // Use the received IPFS hash here
          owner: storedAddress,
        },
      });
      
      const config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: JWT,
        },
        data: data,
      };

      metadataRes = await axios(config);

      console.log(metadataRes.data);
    } catch (error) {
      console.log(error.response.data);
    }
    const TokenUri = `https://crimson-instant-amphibian-770.mypinata.cloud/ipfs/${metadataRes}`;

    await createNFT(
      NFTtitle,
      NFTprice,
      NFTdescription,
      ipfsHash,
      storedAddress
    );
    // Call the fetchLastNFTId function
    let lastNFTId = await fetchLastNFTId();
    // Use the lastNFTId as needed
    console.log('Last NFT ID:', lastNFTId);

    await NFTMint(TokenUri);
    await getTokenId();
    await listNFT(nftAddress, TokenId, NFTprice);
    await toast.update(load, { render: "Success", type: "success", isLoading: false, autoClose: 5000, hideProgressBar: false, closeOnClick: true });
    await toast.success('NFT Created Successfully ', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  };

  const NFTMint = async (tokenUri) => {
    const createNFTTransaction = await nftContract.createToken(tokenUri);
    const receipt = await createNFTTransaction.wait();
    console.log("NFT minted successfully");
    console.log("Transaction hash:", receipt.transactionHash);
  };
  
  let TokenId
  const getTokenId = async() => {
    try {
      const getLastTokenId = await nftContract.getLastTokenId();
      TokenId = await getLastTokenId;
    } catch (error) {
      console.error('Error retrieving token ID:', error);
    }
  }

  const listNFT = async(address, tokenId, price) => {
    const listNFTTransaction = await nftMpContract.createMarketItem(address, tokenId, price);
    const receipt = await listNFTTransaction.wait();
    console.log("NFT Listed successfully");
    console.log("Transaction hash:", receipt.transactionHash);
  }

  const createNFT = async () => {
    const currentAddress = localStorage.getItem("address");
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/createNFT`, {
        title: NFTtitle,
        hash: ipfsHash,
        price: NFTprice,
        creator: currentAddress,
        currentowner: currentAddress,
        description: NFTdescription,
      });
      setNFTtitle("");
      setNFTprice(null);
      setNFTdescription("");
      setImageFile(null);
      console.log("NFT CREATED ", response.data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const fetchLastNFTId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/LastnftId`);
      if (!response.ok) {
        throw new Error('Failed to fetch last NFT ID');
      }
      const data = await response.json();
      return data.lastNFTId;
    } catch (error) {
      console.error('Error fetching last NFT ID:', error);
      // Handle the error
    }
  };

  useEffect(() => {
    // Retrieve the stored address from local storage
    const address = localStorage.getItem("address");
    setStoredAddress(address);
    console.log("CurrentAddress", storedAddress);
    // setProvider(new ethers.providers.Web3Provider(window.ethereum))
    // setSigner(provider.getSigner());
  }, []);

  return (
    <div className="mt-[135px] mb-[100px]">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit(handleSubmission)} className="space-y-8">
          {/* Main Image/Artwork */}
          <div className="relative h-64 w-full">
            {imageFile ? (
              <img
                src={window.URL.createObjectURL(imageFile)}
                alt="Uploaded NFT"
                style={{
                  width: "275px",
                  height: "275px",
                  display: "inline-block",
                  float: "left",
                }}
                className="rounded-md mx-auto"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <span>
                  Drag and drop your NFT image here or click to browse.
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={changeHandler}
              className="absolute inset-0 opacity-0 cursor-pointer"
              name="file"
            />
          </div>
          {/* NFT Details */}
          <div className="space-y-4">
            <label htmlFor="title" className="block text-gray-700 ">
              Item Name
            </label>
            <input
              type="text"
              value={NFTtitle}
              onChange={handleNFTTitleChange}
              placeholder="NFT Title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
            {errors.nftName && (
              <span className="text-red-500">NFT Name is required</span>
            )}

            {/* Price/Auction/Offer Options */}
            <div className="flex items-center space-x-4">
              <input
                type="number"
                step="0.000000000000000001" // Set the desired decimal step value
                onChange={handleNFTPriceChange}
                placeholder="Fixed Price in ETH"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Auction Starting Price"
                {...register("auctionPrice", { required: false })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md ${
                  auctionEnabled ? "" : "cursor-not-allowed opacity-50"
                }`}
                disabled={!auctionEnabled}
              />
              <input
                type="checkbox"
                onChange={handleAuctionEnabledChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="flex-none">Enable Auction</span>
            </div>
            <div className="space-y-2">
              {/* Description */}
              <label htmlFor="description" className="block text-gray-700">
                Description
              </label>
              <span className="text-gray-500 text-sm">
                The description will be included on the item's detail page
                underneath its image.
              </span>
              <input
                type="text"
                onChange={handleNFTdescriptionChange}
                id="description"
                placeholder="Description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* External Link */}
            <div className="space-y-2">
              <label htmlFor="externalLink" className="block text-gray-700">
                External Link
              </label>
              <span className="text-gray-500 text-sm">
                Artify will include a link to this URL on this item's detail
                page, so that users can click to learn more about it. You are
                welcome to link to your own webpage with more details.
              </span>
              <input
                type="text"
                id="externalLink"
                placeholder="External Link"
                {...register("externalLink", { required: false })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Check Boxes */}
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                {...register("unlockableContent", { required: false })}
                className="form-checkbox h-4 w-4  checked:bg-black"
                onChange={(e) => setUnlockableContentEnabled(e.target.checked)}
              />
              <div>
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Unlockable Content
                </span>
                <p className="text-gray-500 text-sm">
                  Include unlockable content that can only be revealed by the
                  owner of the item.
                </p>
              </div>
            </div>
            {unlockableContentEnabled && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter content (access key, code to redeem, link to a file, etc.)"
                  {...register("unlockableContentData", { required: false })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
                />
              </div>
            )}

            <div className="flex items-center space-x-4">
              <Checkbox
                id="explicitContent"
                onChange={() =>
                  setExplicitContentEnabled(!explicitContentEnabled)
                }
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="unlockableContent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Explicit & Sensitive Content
                </label>
                <p className="text-gray-500 text-sm">
                  Set this item as explicit and sensitive content.
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p className="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create
          </button>
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
        </form>
      </div>
    </div>
  );
};

export default NFTListing;
