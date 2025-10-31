import React from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import BlogList from "../components/BlogList";
import NewsLater from "../components/NewsLater";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Header />
      <BlogList />
      <NewsLater />
      <Footer />
    </>
  );
};

export default Home;
