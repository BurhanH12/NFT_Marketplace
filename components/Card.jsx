import React from 'react';
import Link from 'next/link';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";

const Card = ({ nft }) => {
  
  
  const ethValue = 1964.82; // Current value of ETH in USD

  return (
    <div className="border border-black rounded-lg shadow-lg p-4 box-border hover:shadow-indigo-500/50 hover:bg-opacity-50 transition-shadow group">
      <div className='relative overflow-hidden rounded-lg'>
      <img
        src={`https://crimson-instant-amphibian-770.mypinata.cloud/ipfs/${nft.hash}`}
        alt={nft.title}
        className="w-full h-[200px] object-cover rounded-lg mb-4 block mx-auto md:w-48 md:h-[200px]"
      />
      <div className='absolute h-full w-full bg-black/20 flex items-center justify-center -bottom-8 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300 '>
      <Link href={`/NFTdetail/${nft.nftid }`}>
        <button className='bg-black text-white py-2 px-5 rounded-sm text-sm'> Quick View </button>
      </Link>
      </div>
      </div>
      <h2 className="text-xl font-bold mb-2">{nft.title}</h2>
      {/* <p className="text-gray-500">{nft.creator}</p> */}
      <HoverCard>
  {!nft.sold && nft.listed ? (
    <div className="flex">
      <HoverCardTrigger>
      <p className="text-lg font-semibold mt-2">{nft.price} ETH</p>
      </HoverCardTrigger>
    </div>
  ) : (
    <div className="flex">
      
        <p className="text-lg font-semibold mt-2">Sold</p>
    </div>
  )}
  <HoverCardContent className="w-40">
    <div className="flex justify-between space-x-4">
      <div className="space-y-1">
        <p className="text-sm">
          {Math.round(ethValue * nft.price).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
        <div className="flex items-center pt-2">
          <span className="text-xs text-muted-foreground">
            Updated on 5 July 2023
          </span>
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
      {/* Additional details or actions */}
    </div>
  );
};

export default Card;
