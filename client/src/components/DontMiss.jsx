import BlogLists from "./BlogLists";
import BlogCard from "./BlogCard";
import TopStories from "./TopStories";
import { useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { blogHelperQuery } from "../Helper/BlogHelper";
import ToggleMenu from "../utils/ToggleMenu";
import { NavContent } from "../utils/Dummy";

const DontMiss = () => {
  const moreRef = useRef(null);
  const [showOptions, setShowOptions] = useState(false);
  const { pathname } = useLocation();
  const [cat, setCat] = useState("");
  const {theme} = useContext(ThemeContext)
 let linkClass = "text-gray-400 md:text-[16px] text-sm font-semibold hover:text-gray-800 cursor-pointer"
 const {data, isLoading} = blogHelperQuery({size : 1})
  
  ToggleMenu(moreRef, setShowOptions)
 
  let content;
  if (isLoading) {
    <p>Loading...</p>;
  } else if (data && data.ids) {
    content = data.ids?.map((blogId) => (
      <BlogCard
      key={blogId}
        blogId={blogId}
        cat={cat}
        isTrending={false}
        size={1}
        isLatest
        location={pathname}
        data={data}
      />
    ));
  }

  return (
    <div className=" w-full p-4 mt-10">
      <div className="flex gap-8 lg:flex-row flex-col">
        <div className="left-side flex flex-col ">
          <div className="left-header flex justify-between items-center mb-2 px-2">
            <h1 className="font-bold text-[14px] md:text-[16px]">Don't Miss</h1>
            <ul className="flex gap-3 md:gap-20 items-center">
              {
              NavContent?.slice(0, 3).map(nav => <li
              key={nav?.id}
               onClick={() => setCat(`${nav?.category}`)}
               className={linkClass}
              >
               {nav?.link}
              </li>)
              }
             
              <li
                ref={moreRef}
                className="relative text-gray-400  font-semibold  cursor-pointer"
              >
                <button
                  onClick={() => setShowOptions((prev) => !prev)}
                  className="hover:text-gray-800"
                >
                  More
                </button>
                {showOptions && (
                  <ul className={`absolute ${theme.secondary}  top-[2.2rem] z-10 w-[200px] shadow-lg md:-left-24 p-4 -left-32`}>
                   
                   {NavContent?.slice(3).map((nav) => <li className="hover:text-gray-800 md:text-[16px] text-sm" onClick={() => setCat(nav?.category)}>{nav?.link}</li>)}
                   
                  </ul>
                )}
              </li> 
            </ul>
          </div>
          <hr />
          <div className="flex md:flex-row flex-col gap-4 mt-4 ">
            {content}
            <div className="right-content md:w-1/2 w-full">
              <BlogLists cat={cat} />
            </div>
          </div>
        </div>
        <hr className="h-full text-gray-900" />
        <div className="right-side flex flex-col gap-6">
          <div className="">
            <h1 className="mb-2 text-[var(--primary)] font-bold md:text-[20px] text-[16px]">
              About Typique
            </h1>
            <hr />
            <p className="text-gray-400 md:text-[16px]  text-[14px] font-thin">
              Typique is a cutting-edge blogging app that allows users to create
              visually stunning posts using a wide range of unique typographic
              styles. With a user-friendly interface and powerful editing
              tools,Typique is the perfect platform for bloggers and writers
              looking to stand out in a crowded online space.
            </p>
          </div>
          <hr />
          <div className="flex flex-col gap-4">
            {/* Top Stories */}
            <h1 className="text-[var(--primary)] font-bold md:text-[20px] text-[16px]">
              Top Stories
            </h1>
            <hr />
            <TopStories />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DontMiss;
