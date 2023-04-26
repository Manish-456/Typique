
import Comment from "../components/Comment";
import {
  useLike_dislike_postMutation,
} from "../Features/blog/blogApiSlice";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import CommentLists from "../components/CommentLists";
import { useContext, useState } from "react";
import { SocketContext } from "../context/socketContext";
import DateFormat from "../utils/DateFormat";
import { blogwithUserIdQuery } from "../Helper/BlogHelper";
import { userWithUserIdQuery } from "../Helper/UserHelper";
import { API_URL } from "../config";

const Blog = () => {
  const { blogId } = useParams();
  const { id } = useAuth();
  const [edit, setEdit] = useState(false);
  const { socket } = useContext(SocketContext);
  const [commentDetail, setCommentDetail] = useState(null)

  const {blog} = blogwithUserIdQuery(blogId);

  const {user} = userWithUserIdQuery(blog?.userId);

  const [like_dislike_post] = useLike_dislike_postMutation();
  const handleLike_dislike = async () => {
    const payload = {
      blogId: blogId,
      authorId: blog?.userId,
      title: blog?.title,
      clientId: id,
      isLiked: false,
    };
    const { data } = await like_dislike_post(payload);
    if (data?.isLiked) {
      socket?.emit("send-notification", { ...payload, isLiked: true });
    }
    toast.success(data?.message);
  };

  return (
    <>
      
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <main className="max-w-7xl mx-auto px-6 md:px-4">
        <div className="p-4 mt-10">
          <Link to={`/profile/${user?._id}`} className="flex md:flex-row gap-4 flex-col-reverse  md:gap-0 ">
            {/*  */}
            <div className="left-container md:w-1/2 w-full ">
              <img
                className=" w-full object-cover md:w-[80%] "
                src={`${API_URL}/images/${blog?.image}`}
                alt=""
              />
            </div>
            <div className=" right-container">
              <div className="shadow-lg flex p-4  flex-col gap-4 items-center">
                <img
                  src={
                   user?.avatar
                      ? `${API_URL}/images/${user?.avatar}`
                      : "/noavatar.jpg"
                  }
                  className="w-24 h-24 object-cover rounded-full"
                  alt=""
                />
                <h1>{user?.username}</h1>
                <p className="mb-4 text-[13px] md:text-[14px]">{user?.bio}</p>
                <p className="text-gray-400 font-bold">{user?.country}</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="p-4 flex flex-col gap-8">
          <h1 className="text-xl md:text-2xl  font-bold ">{blog?.title}</h1>

          <div className="flex items-center gap-4">
            <Link to={`/profile/${user?._id}`}>
              <img
                src={
                  user?.avatar
                    ? `${API_URL}/images/${user?.avatar}`
                    : "/noavatar.jpg"
                }
                className="w-16 h-16 object-cover rounded-full"
                alt=""
              />
            </Link>
            <div>
              <h1 className="text-gray-400 font-semibold text-[15px]">
                {user?.username}
              </h1>
              <span className="text-sm text-gray-500 ">{DateFormat(blog?.createdAt)}</span>
          
            </div>
          </div>
          <article
          className="md:text-[15px] text-[14px]"
            dangerouslySetInnerHTML={{
              __html: blog?.desc,
            }}
          ></article>
          <div className="flex gap-4 items-center md:flex-row flex-col">
            <div className="flex gap-2">
              <p>was this blog helpful ?</p>
              {!blog?.likes?.includes(id) ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  
                  onClick={handleLike_dislike}
                  className="w-5 h-5 cursor-pointer text-blue-800"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 cursor-pointer text-blue-700"
                  onClick={handleLike_dislike}
                >
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                </svg>
              )}
            </div>
            <span className="text-gray-500 underline  p-4">
              {blog?.likes?.length} People found this blog helpful
            </span>
          </div>
          <div className="mt-4 ">
            <h1 className="font-semibold mb-4  text-gray-400">
              Leave a Comment
            </h1>
            <div className="flex  md:flex-row h-[38.5rem] md:h-full flex-col-reverse gap-4">
              <div
                className="mt-5  "
                style={{
                  flex: 1,
                
                }}
              >
                <Comment edit={edit} setEdit={setEdit} commentDetail={commentDetail} clientId={id} title={blog?.title} authorId={blog?.userId} blogId={blog?.id} />
              </div>
              {blog?.comment?.length > 0 && (
                <div
                  className="shadow mt-4 flex h-10 md:h-64 overflow-x-hidden flex-col overflow-scroll  gap-4"
                  style={{
                    flex: 1,
                  }}
                >
                  {blog?.comment?.map((comment) => (
                    <CommentLists key={comment?._id} setCommentDetail={setCommentDetail} blogId={blog?.id} setEdit={setEdit} comment={comment} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </>
  );
};

export default Blog;
