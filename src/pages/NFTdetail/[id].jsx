import React from 'react'
import { nfts } from '../../../NFTMetadata/Nfts';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Eye , Heart, ShoppingCart } from 'lucide-react';

const NFTDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [nft, setNft] = useState(null);

  useEffect(() => {
    if (id && nfts) {
      const foundNft = nfts.find((n) => n.id === parseInt(id));
      setNft(foundNft);
    }
  }, [id, nfts]);

  if (!nft) {
    return <div>Loading...</div>;
  }

  const ethValue = 1799.0; // Current value of ETH in USD

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
              src={nft.image}
              alt={nft.title}
              className="w-full md:w-3/4 lg:w-2/3 mx-auto rounded-md"
            />
          </div>
          {/* Details */}
          <div className="w-full md:w-1/2 md:pl-8 mx-auto px-4 py-8 text-lg">
            <h1 className="text-2xl font-bold mb-2">{nft.title}</h1>
            <h2 className="text-xl mb-4">Creator: {nft.artist}</h2>
            <p className="mb-4">Current owner: {nft.owner}</p>
            <p className="mb-4 flex items-center">
              <Eye className="mr-1" /> {nft.views.toLocaleString()} Views |{" "}
              <Heart className="mx-1" /> {nft.favorites.toLocaleString()}{" "}
              Favorites
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
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded inline-flex items-center">
              <ShoppingCart className="mr-2" />
              Buy Now
            </button>
          </div>
        </div>
        {/* History */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">History</h2>
          <div className="bg-white shadow-md rounded p-4">
            {/* Add history content here */}
          </div>
        </div>
        {/* Offers */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Offers</h2>
          <div className="bg-white shadow-md rounded p-4">
            {/* Add offers table here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
