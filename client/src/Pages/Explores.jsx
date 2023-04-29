import BlogCard from "../components/BlogCard";
import { useLocation } from "react-router-dom";
import { useGetBlogsQuery } from "../Features/blog/blogApiSlice";
import useTitle from "../hooks/useTitle";

const Explores = () => {
  const location = useLocation();
  const params = new URLSearchParams(location?.search);
  const query = params.get("blog");
  query ? useTitle(query) : useTitle("Explore")
  const { data, error } = useGetBlogsQuery(
    query
      ? {
          blog: query,
        }
      : "blogLists"
  );
  
  const blogs = data?.ids?.map((id) => {
    return data?.entities[id]
  })

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-4">
        <div className="mt-10">
          <div className="p-4 mt-10">
            <div className="flex items-center justify-between md:flex-row flex-col gap-10">
              <div className="md:w-1/2 flex flex-col items-center  md:items-start">
                <h1 className=" text-4xl lg:text-5xl text-[var(--primary)] font-bold">
                  Typique - Explore More{" "}
                </h1>
                <h3 className="text-gray-500 md:text-start text-center  mt-5 text-[18px] md:text-[20px]  w-full">
                  Share Your Ideas And Thoughts To The{" "}
                  <i className="font-cursive">Typique</i> Community
                </h3>
              </div>
              <div className="md:w-1/2">
                <img src="/explore.png" alt="" />
              </div>
            </div>
          </div>
          <h1 className="md:text-3xl text-xl  mb-10 border-b border-gray-300 pb-3  text-center">
            Explore
          </h1>

          {query && (
            <h1 className="mb-4 text-gray-400">
              Result for{" "}
              <span className="underline text-green-500 ">{query}</span>
            </h1>
          )}
          {
            <div className="flex flex-wrap md:gap-2 gap-4">
              {error ? (
                <p className="text-center text-red-500">
                  {error?.data?.message}
                </p>
              ) : (
                blogs?.map((id) => (
                  <BlogCard
                    key={id}
                    blogId={id}
                    location={"/explore"}
                    isTrending={false}
                    isLatest={false}
                  />
                ))
              )}
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Explores;
