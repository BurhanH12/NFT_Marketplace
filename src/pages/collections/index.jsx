import { React, useRef, useState, useEffect } from 'react';
import { Link } from 'next/link';
import { collection } from '../../../NFTMetadata/Nfts'
import { Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const Collections = () => {

  const [timerDay, settimerDay] = useState('00');
  const [timerHour, settimerHour] = useState('00');
  const [timerMin, settimerMin] = useState('00');
  const [timerSec, settimerSec] = useState('00');

  let interval = useRef();

  const startTimer = () => {
    const countdownDate = new Date('July 01 2023 00:00:00').getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)));
      const minutes = Math.floor((distance % (1000 * 60 * 60) / (1000 * 60 )));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000 );

      if (distance < 0) {
        //stop our timer
        clearInterval(interval.current);
      } else {
        //update our timer
        settimerDay(days);
        settimerHour(hours);
        settimerMin(minutes);
        settimerSec(seconds);
      }
    }, 1000 );
  }

  useEffect(() => {
    startTimer();
    return() => {
      clearInterval(interval.current);
    }
  })
  

  return (
    <div className="mt-[135px] mb-[100px] ">
      <div className=" mb-3 border-box">
          <section className="relative bg-white" style={{ backgroundImage: `url("./NFTs/legendary.jpg")`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", height: "300px", width: "100%" }}>
          <section className="bg-black bg-opacity-10 flex flex-col items-center justify-center pb-7em w-full h-full">
              <div className='text-center text-2xl'>
                <span></span>
                  <h2 className=' text-black  font-medium mb-2'>Countdown to this drop</h2>
              </div>
              <div className="border-black border-2 rounded-8px grid grid-cols-7 mt-3em p-3em text-center text-2xl">
                <section>
                  <p>{timerDay}</p>
                  <p>Days</p>
                </section>
                <span>:</span>
                <section>
                  <p>{timerHour}</p>
                  <p>Hours</p>
                </section>
                <span>:</span>
                <section>
                  <p>{timerMin}</p>
                  <p>Minutes</p>
                </section>
                <span>:</span>
                <section>
                  <p>{timerSec}</p>
                  <p>Seconds</p>
                </section>
              </div>
              <div className='mt-5'>
                <Button className="cursor-not-allowed opacity-80">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </Button>
              </div>
            </section>
          </section>
        </div>
      <div className="mt-8 mx-5">
        <div className="text-2xl mb-3">
          <h1>Top Collections today</h1>
        </div>
        <Table>
          <TableCaption className="text-center">
            A list of the top collections.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Collection</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead className="text-right">Floor Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collection.map((collection) => (
              
                <TableRow key={collection.name}>
                  <TableCell className="font-medium flex items-center">
                    <img src={collection.image} alt={collection.name} className="w-[80px] h-[70px] mr-2 rounded-md" />
                    {collection.name}
                  </TableCell>
                  <TableCell>{collection.status}</TableCell>
                  <TableCell>{collection.volume}</TableCell>
                  <TableCell className="text-right">
                    {collection.floorPrice}
                  </TableCell>
                </TableRow>
              
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Collections;
