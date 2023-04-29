import { Link, useLocation } from "react-router-dom";
import { memo } from "react";
import DateFormat from "../utils/DateFormat";
import useAuth from "../hooks/useAuth";
import { useViewsMutation } from "../Features/blog/blogApiSlice";
import { userWithUserIdQuery } from "../Helper/UserHelper";
import useDOMParser from "../hooks/useDOMParser";
const BlogCard = ({
  blogId : blog,
  setBlogId,
  location,
  setOpenDialogue,
  setTitle,
}) => {
  const { pathname } = useLocation();
  const { id } = useAuth();
  

  const [views] = useViewsMutation();

  const handleView = async () => {
    try {
    await views({ blogId: blog?._id });
    
    } catch (error) {}
  };


  let cardClass = "shadow-md p-2 rounded-sm overflow-hidden";
  if (pathname === "/home") {
    cardClass += " md:w-1/2 w-full";
  } else {
    cardClass += " md:w-[30%] w-full";
  } 
 
  const {user} = userWithUserIdQuery(blog?.userId);
   const truncatedText = useDOMParser(blog?.desc, 90)
  return (
    <div className={cardClass}>
      <Link to={`/blog/${blog?._id}`} className="overflow-hidden rounded-xl w-full">
        <img
          src={`${blog?.image}`}
                  onClick={handleView}
          className="w-full h-64 object-cover rounded-xl  img-animation"
          alt=""
        />
      </Link>

      <div className="card-content mt-4 p-1">
        <Link to={`/blog/${blog?._id}`}>
          <h1
            title={blog?.title}
            onClick={handleView}
            className="font-bold text-[16px] md:text-[18px] hover:underline cursor-pointer"
          >
            {blog?.title?.length < 20 ? blog?.title : `${blog?.title?.slice(0, 30)}...`}
          </h1>
        </Link>
         
        <article className="mt-4 text-[14px] md:text-[16px] text-gray-400" >{truncatedText}</article>


        <div className="flex justify-end  gap-2 mt-4 mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5  text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
          <p className="text-sm text-gray-400 cursor-pointer" title={`${blog?.likes?.length} likes`}>{blog?.likes?.length || 0}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <p className="text-sm text-gray-400 cursor-pointer" title={`${blog?.comment?.length} Comments`}>{blog?.comment?.length || 0}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              title={"Views"}
            />
          </svg>

          <p className="text-sm text-gray-400 cursor-pointer" title={`${blog?.view?.length} Views`}>{blog?.view?.length || 0}</p>
        </div>
        {
          <div className="flex justify-between items-center">
            <Link
              to={`/profile/${user?._id}`}
              className="flex gap-4 mb-2 items-center mt-3"
            >
              <img
                src={
                  user?.avatar
                    ? `${user?.avatar}`
                    : "/noavatar.jpg"
                }
                className=" md:w-[3rem] w-[2rem] h-[2rem] md:h-[3rem]  rounded-full object-cover"
              />
              <div>
                <p className=" mt-4  text-[13px] md:text-[15px]">{user?.username}</p>
                <span className="hover:text-blue-500 text-[12px] cursor-pointer">
                  {DateFormat(blog?.createdAt)}
                </span>
              </div>
            </Link>
            {id === user?._id && location === "/profile" && (
              <div className="flex relative  gap-4 mt-4 p-1">
                <div
                  title="Delete"
                  className="hover:bg-gray-300 hover:text-red-800 p-2 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    onClick={() => {
                      setOpenDialogue(true);
                      setTitle(blog?.title);
                      setBlogId(blog?._id);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <Link to={`/blog/update/${blog?._id}`}>
                  <div
                    title="Edit"
                    className="hover:bg-gray-300 hover:text-green-800 p-2 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};

const blogCard = memo(BlogCard);
export default blogCard;
