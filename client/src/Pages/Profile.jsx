import EditProfile from "../components/EditProfile";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import BlogCard from "../components/BlogCard";
import { ThemeContext } from "../context/ThemeContext";
import BlogDialogue from "../components/BlogDialogue";
import { userWithUserIdQuery } from "../Helper/UserHelper";
import { blogHelperQuery } from "../Helper/BlogHelper";

import { API_URL } from "../config";

const Profile = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { userId } = useParams();
  const { id } = useAuth();
  const { theme } = useContext(ThemeContext);

  const [openDialogue, setOpenDialogue] = useState(false);

  const [title, setTitle] = useState("");
  const [blogId, setBlogId] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const [user, setUser] = useState(null);

  let { user: userDetail } = userWithUserIdQuery(userId);

  useEffect(() => {
    setUser({ ...userDetail });
  }, [userDetail]);

  const { data, isLoading } = blogHelperQuery({ sort: true });

  useEffect(() => {
    if (data) {
      const newBlogIds = [...data.ids];
 

      const newBlogs = newBlogIds.map((id) => data?.entities[id]);
      setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
    }
    return () =>  setBlogs([])


  }, [data]);



  const ownBlog = blogs?.filter((blog) => {
    return blog?.userId === userId;
  });

  return (
    <div className={openDrawer ? `${theme.primary}` : "white"}>
      <div className="max-w-7xl mx-auto px-6 md:px-4 relative">
        {openDrawer && (
          <div
   
            className="  
       w-full md:w-1/2 mx-auto  sticky top-20 bottom-0  z-10 bg-white"
        
        >
            <EditProfile userInfo={user} setOpenDrawer={setOpenDrawer} />
          </div>
        )}
        {openDialogue && (
          <div
            className={`${theme.secondary} flex flex-col  
       gap-4 translate-y-[200%] rounded-xl translate-x-[10%] shadow shadow-blue-400 md:translate-x-[80%]    fixed  w-[70%] md:w-[25%] mx-[5%]  z-10`}
          >
            <BlogDialogue
              blogId={blogId}
              title={title}
              setOpenDialogue={setOpenDialogue}
            />
          </div>
        )}
        <div
          className={`${
            (openDrawer || openDialogue) && "opacity-10 cursor-none"
          }   p-4`}
        >
          <div className="flex md:flex-row flex-col gap-4">
            <div className="left-container  rounded-xl flex gap-4 flex-col items-center justify-center">
              <div>
                <img
                  src={
                    user?.avatar
                      ? `${API_URL}/images/${user?.avatar}`
                      : "/noavatar.jpg"
                  }
                  className="w-32 h-32 object-cover  rounded-full"
                  alt=""
                />
              </div>
              <div className="text-center  flex flex-col gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-gray-500">
                  {user?.username}
                </h1>
                <article dangerouslySetInnerHTML={{__html : user?.bio}} className="text-sm font-semibold text-gray-400">
                  
                </article>
                {user?.webLink && (
                  <div className="flex justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>

                    <Link
                      target={"_blank"}
                      className="underline text-center text-blue-500 text-sm"
                      to="https://nextoyoutube.netlify.app"
                    >
                      {user?.webLink}
                    </Link>
                  </div>
                )}
                {userId === id && (
                  <button
                    className="primary mt-10"
                    onClick={() => setOpenDrawer((prev) => !prev)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
            <div className="right-container items-center  p-2  flex flex-col gap-4 ">
              <h1 className="text-center text-xl text-gray-400 font-bold">
                About
              </h1>

              <div className="p-2 flex flex-col  gap-4">
                {user?.country && (
                  <div className="flex gap-2  items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm md:text-[15px]">
                      Live : {user?.country}
                    </p>
                  </div>
                )}
                {user?.email && (
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>

                    <p
                      className="text-gray-500 text-sm md:text-[15px]
                     "
                    >
                      Email : {user?.email}
                    </p>
                  </div>
                )}
                {user?.worksAt && (
                  <div className="flex gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                      />
                    </svg>

                    <p
                      className="text-gray-500 text-sm md:text-[15px]
                    "
                    >
                      Works At : {user?.worksAt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h1 className="text-center text-xl md:text-2xl font-semibold text-gray-400 mx-auto">
              {userId === id ? "Your Blogs" : "Blogs"}
            </h1>
            <div className="">
              <div className="flex flex-wrap md:gap-2 gap-4">
                {ownBlog?.map((blog) => (
                  <BlogCard
                    blogId={blog?.id}
                    location={"/profile"}
                    isTrending={false}
                    setTitle={setTitle}
                    key={blog?.id}
                    setBlogId={setBlogId}
                    isLatest={false}
                    setOpenDialogue={setOpenDialogue}
                  />
                ))}
              </div>
              {isLoading && "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
