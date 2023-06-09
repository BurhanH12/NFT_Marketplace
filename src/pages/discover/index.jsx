import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const Discover = () => {

  const [nfts, setNFTs] = useState([]);

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

  if (nfts.length === 0) {
    return <div>Loading...</div>;
  }
  

  const shuffledNfts = [...nfts].sort(() => Math.random() - 0.5);
  const shuffledNfts2 = [...nfts].sort(() => Math.random() - 0.5);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      partialVisibilityGutter: 0,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 4,
      partialVisibilityGutter: 30,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      partialVisibilityGutter: 20,
    },
  };

  return (
    <div className="">
    <div className="mt-[135px] mb-[100px] ">
      <div
        className="min-h-[500px]  bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/geometric.gif')" }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Discover and Collect Extraordinary NFTs
          </h1>
          <p className="text-lg text-grey-800">
            Welcome to the largest NFT marketplace
          </p>
        </div>
      </div>
      <div className="mt-8 mx-5">
        <h1 className="text-3xl">Most Popular NFTs</h1>
      </div>
      <div className="mt-4 mx-5">
        <Carousel
          responsive={responsive}
          infinite={true}
          arrows={true}
          additionalTransfrom={0}
          autoPlay
          draggable
          minimumTouchDrag={80}
          autoPlaySpeed={5000}
          customTransition="all 1s linear"
          transitionDuration={500}
          showDots={false}
          containerClass="carousel-container"
          itemClass="carousel-item mx-2"
          partialVisible={true}
        >
          {shuffledNfts.map((nft) => (
            <Card key={nft.id} nft={nft} />
          ))}
        </Carousel>
      </div>
      <div className="mt-8 mx-5">
        <h1 className="text-3xl">Trending</h1>
      </div>
      <div className="mt-4 mx-5">
        <Carousel
          responsive={responsive}
          infinite={true}
          arrows={true}
          additionalTransfrom={0}
          autoPlay
          draggable
          minimumTouchDrag={80}
          autoPlaySpeed={7000}
          customTransition="all 1s linear"
          transitionDuration={800}
          showDots={false}
          containerClass="carousel-container"
          itemClass="carousel-item mx-2"
        >
          {shuffledNfts2.map((nft) => (
            <Card key={nft.id} nft={nft} />
          ))}
        </Carousel>
      </div>
    </div>
    </div>
  );
};

export default Discover;
