import React from "react";
import Image from "next/image";
import { featuredSellers } from "../../../NFTMetadata/Nfts";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../../components/ui/hover-card";

const NFTCard = ({ nft }) => {
  const ethValue = 1799.0; // Current value of ETH in USD

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="w-full h-64 relative">
        <Image
          src={nft.image}
          alt={nft.title}
          layout="fill"
          objectFit="cover"
          className="object-cover rounded-lg mb-4 block"
        />
      </div>
      <h3 className="text-lg font-semibold mt-2">{nft.title}</h3>
      <HoverCard>
        <div className="flex">
          <p className="text-gray-600">Sold For:</p>
          <HoverCardTrigger>
            <p className="ml-1">{nft.soldfor} ETH</p>
          </HoverCardTrigger>
        </div>
        <HoverCardContent>
          <div className="flex justify-between space-x-4">
            <div className="space-y-1">
              <p className="text-sm">
                {Math.round(ethValue * nft.soldfor).toLocaleString("en-US", {
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
    </div>
  );
};

const FeaturedSellerCard = ({ seller }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 ">
      <div className="flex items-center mb-4">
        <div className="w-18 h-18 rounded-full overflow-hidden">
          <Image
            src={seller.profileImage}
            alt={seller.username}
            layout="fixed"
            width={160}
            height={160}
          />
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-semibold">{seller.username}</h2>
          <p className="text-gray-600">{seller.tagline}</p>
        </div>
      </div>
      <div className="space-y-4">
        {seller.topSellingNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
};

const FeaturedSellers = () => {
  return (
    <div className="mt-[150px] mb-[100px]">
      <div className="container mx-auto px-4">
        <div className="mt-7 mx-5">
          <h1 className="text-4xl font-italic mb-7">Featured Sellers Today</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSellers.map((seller) => (
            <FeaturedSellerCard key={seller.id} seller={seller} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSellers;
