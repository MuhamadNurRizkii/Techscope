import React from "react";
import { assets } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const { navigate, token } = useAppContext();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32 cursor-pointer">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold cursor-pointer text-primary"
      >
        TechScope
      </h1>
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5"
      >
        {token ? "Dashboard" : "login"}
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
