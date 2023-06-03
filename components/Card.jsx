import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../components/ui/hover-card";

const Card = ({ nft }) => {
  
  const ethValue = 1799.0; // Current value of ETH in USD

  return (
    <div className="border border-grey-400 rounded-lg shadow-lg  p-4 box-border hover:shadow-2xl ">
      <img src={nft.image} alt={nft.title} className="w-48 h-[200px] object-cover rounded-lg mb-4 block" />
      <h2 className="text-xl font-bold mb-2">{nft.title}</h2>
      <p className="text-gray-500">{nft.artist}</p>
      <HoverCard>
        <div className="flex">
          <HoverCardTrigger>
            <p className="text-lg font-semibold mt-2">{nft.price} ETH</p>
          </HoverCardTrigger>
        </div>
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
                  Updated on 25 May 2023
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
