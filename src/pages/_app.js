import "../styles/globals.css";

import Navbar from "../../components/Navbar";
import Navbar2 from "../../components/Navbar2";
import Home from ".";
import Footer from "../../components/Footer";


export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
