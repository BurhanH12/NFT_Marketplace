import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import MainTabs from "../../components/MainTab";


const Home = () => {
  
  const slides = [
    {
      url: "/yellow.png",
    },
    {
      url: "/galaxyNFT.png",
    },
    {
      url: "/Enviroment.jpg",
    },
    {
      url: "/colours.png",
    },
    {
      url: "/vibrant.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // #f9287f as the ring colour
  // #f9287f80 backgroud colour
  //checkout https://tailwindcss.com/docs/background-image#linear-gradients
  //add coloured drop shadow to cards

  return (
    <div className="bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300">
      <div className="mt-[90px] group">
        <div className="max-w-[1400px] h-[660px] w-full m-auto pt-16 pb-4 px-4">
          <div
            style={{
              backgroundImage: `url(${slides[currentIndex].url})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="w-full h-[400px] md:h-[580px] rounded-2xl bg-center bg-cover duration-500"
          ></div>
        </div>
        <div className="hidden group-hover:block absolute top-[70%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactLeft onClick={prevSlide} size={30} />
        </div>
        <div className="hidden group-hover:block absolute top-[70%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactRight onClick={nextSlide} size={30} />
        </div>
        <div className="flex top-4 justify-center py-2 w-[1400]">
          {slides.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className="text-2xl cursor-pointer"
            >
              <RxDotFilled />
            </div>
          ))}
        </div>
      </div>
      <div>
        <MainTabs />
      </div>
    </div>
  );
};

export default Home;
