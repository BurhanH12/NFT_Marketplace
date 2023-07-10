import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";

const NFTOwned = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storedAddress, setStoredAddress] = useState("");

  const fetchOwnedNFTs = async () => {
    try {
        console.log("Stored Address: ",storedAddress);
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/nft/ownedby/${storedAddress}`
      );
      const data = await response.json();
      setNFTs(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {

    const address = localStorage.getItem("address");
    setStoredAddress(address);
    console.log("CurrentAddress", storedAddress);

    fetchOwnedNFTs();
  }, [storedAddress]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (nfts.length === 0) {
    return <div>No NFTs found.</div>;
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
        </div>
      </div>
    </div>
  );
};

export default NFTOwned;
