import { Link, useLocation } from "react-router-dom";

import { subTitle } from "../utils/Dummy";
import BlogCard from "../components/BlogCard";

import { useEffect, useState } from "react";

import { blogHelperQuery } from "../Helper/BlogHelper";
import useTitle from "../hooks/useTitle";
import useScrollToTop from "../hooks/useScrollToTop";

const Category = () => {
  const { search } = useLocation();
  const [blogs, setBlogs] = useState([]);
  const params = new URLSearchParams(search);
  const cat = params.get("cat");
  useScrollToTop()
  const { data, isLoading } = blogHelperQuery({
    cat: cat,
  });
  
  useEffect(() => {
    if (data) {
      const newBlogIds = [...data?.ids];
      
      const newBlogs = newBlogIds?.map((id) => data?.entities[id]);
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
    }
    return () => setBlogs([]);
  }, [data]);
  
  
  let result = subTitle?.filter((item) => item?.name === cat?.toLowerCase());
  useTitle(`(${blogs?.length}) ${cat}`)

  return (
    <>
      <main className="max-w-7xl mx-auto px-1 md:px-4">
        {/* Update later */}
        <div className="p-4 mt-10">
          <div className="flex items-center justify-between md:flex-row flex-col gap-10">
            <div className="md:w-1/2 mx-auto flex flex-col items-center  md:items-start">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  to={`/home`}
                  className=" hover:underline text-4xl lg:text-5xl text-[var(--primary)] font-bold"
                >
                  Typique{" "}
                </Link>
                <span className="text-xl ">
                  {">>"} {cat?.toUpperCase()}
                </span>
              </div>
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
                {result[0]?.text}
              </p>
            </div>
            <div className="w-1/2">
              <img className="w-full" src={result[0]?.image} alt="" />
            </div>
          </div>
        </div>
        <div className="mt-10 ">
          <h1 className="text-2xl font-semibold text-center mb-4  text-gray-400 ">
            {cat?.toUpperCase()}
          </h1>
          <div className="flex flex-wrap md:gap-2 gap-4 justify-center">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              blogs?.map((blog) => (
                <BlogCard  blogId={blog} key={blog?.id} />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Category;
