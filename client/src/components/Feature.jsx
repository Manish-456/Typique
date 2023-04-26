import React from "react";
import {useNavigate} from 'react-router-dom'
import useAuth from "../hooks/useAuth";

const Feature = () => {
  const navigate = useNavigate();
  const {id} = useAuth();
  
  const handleStart = () => {
    navigate('/auth')
  }
 
  return (
    <div className="p-4 mt-10">
      <div className="flex items-center justify-between md:flex-row flex-col gap-10">
        <div className="md:w-1/2 flex flex-col items-center  md:items-start">
          <h1 className=" text-4xl lg:text-5xl text-[var(--primary)] font-bold">
            Typique{" "}
          </h1>
          <h3 className="md:text-start text-center  mt-5 text-[18px] md:text-2xl  w-full">
            Redefining Blogging with Unique Typographic Styles
          </h3>
          <p
            className="text-gray-500 mt-6
            text-[16px]
            md:text-start
            text-center
            "
          >
            Typique is a cutting-edge blogging app that allows users to create
            visually stunning posts using a wide range of unique typographic
            styles. With a user-friendly interface and powerful editing
            tools,Typique is the perfect platform for bloggers and writers
            looking to stand out in a crowded online space.
          </p>
          <div className="mt-10 flex gap-4  ">
          
          {!id &&   <button className="secondary-btn" onClick={handleStart}>Get Started</button>}
          </div>
        </div>
        <div className="md:w-1/2">
          <img src="./blog-main.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Feature;