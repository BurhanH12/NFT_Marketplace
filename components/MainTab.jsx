import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Card from "./Card";
import Link from "next/dist/client/link";

const MainTabs = () => {
  
  const [nfts, setNFTs] = useState([]);
  const [activeTab, setActiveTab] = useState("buyers");

  useEffect(() => {
    // Fetch NFT data from the API and update the state
    const fetchNFTs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getNfts`);
        const data = await response.json();
        setNFTs(data);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };
  
    fetchNFTs();
  }, []);
  
  // Move the conditional rendering of the loading state inside the useEffect hook
  if (nfts.length === 0) {
    return <div>Loading...</div>;
  }
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  


  return (
    <div className="max-w-[1400px] m-auto p-6">
      <div dir="ltr" data-orientation="horizontal">
        <div className="flex items-center justify-center mt-2 mb-8">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="inline-flex h-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
            tabIndex="0"
            data-orientation="horizontal"
          >
            <div className=" rounded-md">
              <Button
                type="button"
                role="tab"
                aria-selected={activeTab === "buyers"}
                aria-controls="radix-:Rjd6pja:-content-for-buyers"
                data-state={activeTab === "buyers" ? "active" : "inactive"}
                id="radix-:Rjd6pja:-trigger-for-buyers"
                className={`tab-button inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  ${
                  activeTab === "buyers"
                    ? "bg-primary text-white"
                    : "bg-purple-300 text-foreground shadow-sm"
                }`}
                tabIndex={activeTab === "buyers" ? "0" : "-1"}
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("buyers")}
              >
                For Buyers
              </Button>
              <Button
                type="button"
                role="tab"
                aria-selected={activeTab === "sellers"}
                aria-controls="radix-:Rjd6pja:-content-for-sellers"
                data-state={activeTab === "sellers" ? "active" : "inactive"}
                id="radix-:Rjd6pja:-trigger-for-sellers"
                className={`tab-button inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  ${
                  activeTab === "sellers"
                    ? "bg-primary text-white"
                    : "bg-purple-300 text-foreground shadow-sm"
                }`}
                tabIndex={activeTab === "sellers" ? "0" : "-1"}
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("sellers")}
              >
                For Sellers
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs content */}
        <div
          role="tabpanel"
          tabIndex="-1"
          className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {activeTab === "buyers" && (
            <div>
              <div className="justify-center">
                <div className="flex-col text-center">
                  <h1 className="text-3xl">
                    "Experience Art In A New Dimension"
                  </h1>
                </div>
                <div className="flex-col text-center">
                  <div className="">
                    <h2 className="text-xl">
                      Find unique NFTs that capture the essence of creativity
                      and own a piece of art history
                    </h2>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h1 className="text-2xl">Top Picks for Today</h1>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-7">
                  {nfts.slice(0, 5).map((nft) => (
                    <Card key={nft.id} nft={nft} />
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "sellers" && (
            <div className="justify-center">
              <div className="flex-col text-center">
                <h1 className="text-3xl">
                  "Turn your Art into Digital Assets"
                </h1>
              </div>
              <div className="flex-col text-center">
                <div className="">
                  <h2 className="text-xl">
                    Join our vibrant community and showcase your unique
                    creations to collectors worldwide
                  </h2>
                </div>
                <div className="mt-5">
                  <Button>
                    <Link href="/NFTsell">Create Your Own NFT</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainTabs;
