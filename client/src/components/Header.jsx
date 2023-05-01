import { useContext, useEffect, useRef, useTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ToggleMenu from "../utils/ToggleMenu";
import { useLogoutMutation } from "../Features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import Notifications from "./Notifications";
import { SocketContext } from "../context/socketContext";
import { useGetNotificationsQuery } from "../Features/blog/blogApiSlice";
import { ThemeContext } from "../context/ThemeContext";
import useWindowResize from "../hooks/useWindowResize";
import { userWithUserIdQuery } from "../Helper/UserHelper";
import { blogHelperQuery } from "../Helper/BlogHelper";
import SearchHelper from "./SearchHelper";
import { NavContent } from "../utils/Dummy";


const Header = () => {
  const { socket } = useContext(SocketContext);
  const [open, setOpen] = useState(false);

  const { toggledTheme, themes } = useContext(ThemeContext);
  const dropDownRef = useRef(null);
  const [showInput, setShowInput] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [downMenu, setDownMenu] = useState(false);
  const profileRef = useRef(null);
  const [openNotification, setOpenNotification] = useState(false);
  const { id } = useAuth();
  const [showLogo, setShowLogo] = useState(true);
  const notificationRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState([]);
  const inpRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [logout] = useLogoutMutation();
  const inpSearchRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPending, startTransition] = useTransition();
  // ? Hide the dropdown menu when we click on anywhere
  const navigate = useNavigate();
  const searchResultsRef = useRef(null);
  const windowSize = useWindowResize();
  const { data } = useGetNotificationsQuery("blogLists", {
    pollingInterval: 30000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const count = localStorage.getItem(id);

  const { theme } = useContext(ThemeContext);
  const { data: blogs, isError } = blogHelperQuery({ blog: searchText });

  let blogResults = isError ? (
    <p className="p-4 text-center">No Results found</p>
  ) : (
    blogs?.ids?.slice(0, 5).map((blogId) => {
      return <SearchHelper key={blogId} blogId={blogId} />;
    })
  );
  const handleShowInput = () => {
    setShowInput((prev) => !prev);
    setShowLogo((prev) => !prev);
    setIsFocused(false)
  };

  useEffect(() => {
    if (windowSize[0] > 567) {
      setShowLogo(true);
    }
  
  }, [windowSize]);

  useEffect(() => {
    if (data) {
      setNotifications(data);
    }
    return () => setNotifications([]);
  }, [data]);
  ToggleMenu(inpRef, setShowInput);
  ToggleMenu(dropDownRef, setOpen);
  ToggleMenu(profileRef, setDownMenu);
  ToggleMenu(notificationRef, setOpenNotification);

  let catLinkClass =
    "md:text-md hover:text-gray-400 text-[14px]  font-semibold ";
  let searchBox, divBox, img;

  if (windowSize[0] <= 640 && !showInput) {
    searchBox = "hidden";
    divBox = "";
    img = "w-[2rem]";
  } else {
    searchBox = "block";
    img = "w-[3.1rem]";
    divBox = "w-[80%]";
  }
  let handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
      localStorage.removeItem("theme")
      socket.close();
    } catch (error) {}
  };
  let imgClass = " w-[50px] md:w-[100px]";
  if (!id) {
    imgClass = "w-[50px] md:w-[100px]";
  }
  const catLink = NavContent?.slice(1).map((nav) => (
    <li key={nav?.id} className={""}>
      <Link
        className={catLinkClass}
        onClick={() => setIsDrawerOpen(false)}
        to={`/category/?cat=${nav?.category}`}
      >
        {nav?.link}
      </Link>
    </li>
  ));

  const dropClass = `md:text-md text-[17px] font-semibold ${theme.textColor} hover:text-gray-500`;
  const navClass = ` hover:text-gray-400 font-semibold md:text-[15px] text-[14px]`;
  useEffect(() => {
    socket?.on("notify", (message) => {
      setArrivalMessage(message);
    });
  }, [socket]);
 
  const linkFunc = ( link, text) => {
    return (
      <li className={navClass}>
        <Link to={link}>{text}</Link>
      </li>
    )
  }

  useEffect(() => {
    if (arrivalMessage) {
      setNotifications((prev) => [...prev, arrivalMessage]);
      setNotificationCount((prev) => [...prev, arrivalMessage]);
      localStorage.setItem(id, notificationCount.length);
      // return () => localStorage.setItem(id, notificationCount.length + 1);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const storedNotificationCount = localStorage.getItem(id);

    if (storedNotificationCount) {
      setNotificationCount(
        new Array(parseInt(storedNotificationCount)).fill("")
      );
    }
  }, []);

  const { user } = userWithUserIdQuery(id);
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/explore/?blog=${searchText}`);
      setSearchText("");
    }
  };
  const handleFocus = () => {
    setIsFocused(true);
  };




  
  const handleChange = (e) => {
    startTransition(() => {
      setSearchText(e.target.value);
    });
  };
  ToggleMenu(inpSearchRef, setIsFocused)
  return (
    <header
      className={`${theme.secondary} w-full sticky z-[999] top-0 shadow-lg`}
    >
      <div className=" max-w-7xl mx-auto md:px-4 px-6">
        <div className="flex justify-between  gap-4 items-center h-16 ">
          {/* Logo */}
          {showLogo && (
            <div
              onClick={() =>{navigate("/home")}}
              className="  lg:w-[15%] xl:w-[12%] w-[35%] sm:w-[19%]"
            >
              <img src="/Logo.svg" alt="" className={imgClass} />
            </div>
          )}
          {/* Links */}
          {id && (
            <div ref={inpSearchRef} className={`${divBox} relative   flex gap-2 mr-4 p-4`}>
              <input
                     type="search"
                     onKeyDown={handleSearch}
                     value={searchText}
                     
                     onChange={handleChange}
                 
                     placeholder="Search by keywords"
                     className={` ${searchBox} w-[80%] shadow-md p-1 rounded-xl outline-none border-none focus:outline-blue-400 border bg-transparent border-gray-400 mx-auto`}
                     onFocus={handleFocus}
              />

              {isFocused && (
                <div
                  ref={searchResultsRef}
               
                  className={`fixed  top-16 ${theme?.secondary} md:w-[35%] w-[50%] ml-[3%]`}
                >
                  {blogResults}
                </div>
              )}

              <button className="primary  sm:hidden block rounded-full md:rounded-md">
                {!showInput ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    onClick={handleShowInput}
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    onClick={handleShowInput}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          {id && (
            <div
              className={`${
                isDrawerOpen
                  ? `${theme.secondary} mobile-menu desktop-menu`
                  : "desktop-menu"
              }`}
            >
              <ul className="flex md:flex-row flex-col gap-10 list-none">
                {linkFunc('/home', "Home")}
                {linkFunc('/explore', "Explore")}
                
                <li className="relative " ref={dropDownRef}>
                  <button
                    className="flex gap-2 md:text-[15px] text-[14px] items-center hover:text-gray-400 font-semibold"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    Categories{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mt-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  <ul
                    className={`md:absolute static ${theme.secondary} ${
                      open ? "block" : "hidden"
                    } md:shadow-md shadow-none px-10 py-2  left-[-80px] top-[47px]  w-[350px]`}
                  >
                    {catLink}

                   
                  </ul>
                </li>
              </ul>
              <div>
                {/* dark mode */}
                {themes === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    onClick={toggledTheme}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                    onClick={toggledTheme}
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                )}
              </div>
              {!id && (
                <div className="flex md:flex-row flex-col gap-10">
                  <button className="primary md:text-md text-[17px]">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
          {/* notification */}
          {id && !showInput && (
            <div className="relative" ref={notificationRef}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                onClick={() => {
                  setOpenNotification((prev) => !prev);
                  setNotificationCount([]);

                  localStorage.removeItem(id);
                }}
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                />
              </svg>
              {count > 0 && (
                <div className="absolute -right-2 -top-2 bg-red-500 md:h-6 h-5 w-5 md:w-6 flex justify-center  rounded-xl">
                  <p className=" text-sm text-white">{count}</p>
                </div>
              )}
              {openNotification && (
                <div
                  className={`fixed h-[99%] md:h-80 overflow-auto cursor-grab  top-[4.1rem] md:top-[4.5rem] flex flex-col gap-4 right-0 md:right-32 p-4 ${theme?.secondary}`}
                >
                  <h1 className=" font-bold text-center border-b p-2">
                    Notifications
                  </h1>
                  {notifications?.map((notification) => (
                    <Notifications
                      key={notification?._id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {id && (
            <div className="relative " ref={profileRef}>
              {" "}
              {!showInput && (
                <div className="h-8 w-8">
                  {" "}
                  <img
                    onClick={() => {
                      setDownMenu((prev) => !prev);
                    }}
                    src={
                      user?.avatar
                        ? `${user?.avatar}`
                        : "/noavatar.jpg"
                    }
                    title={user?.username}
                    className={`md:w-[4rem] 
              h-[2rem] md:h-[2rem] w-[2rem]  rounded-full object-cover ${img} `}
                  />
                </div>
              )}
              <ul
                className={`absolute ${
                  theme.secondary
                } md:w-[150px] w-[130px] -left-10 md:left-[-6rem] top-[60px] p-4 shadow-xl  ${
                  downMenu ? "block" : "hidden"
                }`}
              >
                <li className={dropClass}>
                  <Link to={`/profile/${id}`}>Profile</Link>
                </li>
                <li className={dropClass}>
                  <Link to={"/create/blog"}>Create Blog</Link>
                </li>
                <li className={dropClass}>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}

          {id && (
            <div
              className="md:hidden block z-[999]"
              onClick={() => {
                setIsDrawerOpen((prev) => !prev);
                setShowInput(false);
                setShowLogo(true);
              }}
            >
              {isDrawerOpen ? (
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
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
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
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
