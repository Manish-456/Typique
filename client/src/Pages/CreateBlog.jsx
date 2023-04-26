import { useContext, useEffect, useReducer, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Editor from "../components/Editor";
import {
  selectBlogById,
  useAddNewBlogsMutation,
  useUpdateBlogMutation,
} from "../Features/blog/blogApiSlice";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { blogwithUserIdQuery } from "../Helper/BlogHelper";
import { API_URL } from "../config";
import { NavContent } from "../utils/Dummy";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { id: userId } = useAuth();
  const { blog } = blogwithUserIdQuery(id);

  const { themes } = useContext(ThemeContext);
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState(false);
  const [tempFile, setTempFile] = useState("");
  const [category, setCategory] = useState("tech");
  const [title, setTitle] = useState("");
  const [addNewBlogs, { isLoading }] = useAddNewBlogsMutation();
  const [updateBlog, { isLoading: loading }] = useUpdateBlogMutation();

  const handleImg = (e) => {
    const img = e.target.files && e.target.files[0];
    setFile(img);

    const blob = new Blob([img], { type: img.type });

    setTempFile(URL.createObjectURL(blob));
  };
  let optionClass = "";
  useEffect(() => {
    if (!id) {
      setDesc("");
      setTitle("");
      setCategory("tech");
    } else {
      setDesc(blog?.desc);
      setTitle(blog?.title);
      setCategory(blog?.category);
    }
  }, [id]);

  if (themes === "light") {
    optionClass = "bg-white";
  } else {
    optionClass = "bg-gray-600";
  }

  const handleUpload = async () => {
    const data = new FormData();
    const fileName = Date.now() + file.name;

    data.append("file", file, fileName);
    try {
      fetch(`${API_URL}/upload`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => toast.success(res.message));

      setFile(fileName);
    } catch (error) {

    }
  };

  const handleCreate = async () => {
    const blogDetails = {
      title,
      category,
      image: file,
      desc,
    };
    if (id) {
      const { data } = await updateBlog({ ...blogDetails, blogId: id });
      toast.success(data?.message);
      navigate(`/profile/${userId}`);
    } else {
      try {
        const { data } = await addNewBlogs(blogDetails);
        toast.success(data?.message);
        navigate(`/profile/${userId}`);
      } catch (error) {}
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex flex-col  gap-8 mt-10 md:max-w-[50%] max-w-7xl mx-auto px-6 md:px-4">
        <h1 className="text-3xl text-gray-400 text-center">
          {id ? "Update" : "Create"} A Blog
        </h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-4 border font-bold text-lg bg-transparent  border-gray-500 rounded-xl"
          placeholder="Write a Title here"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-gray-400 text-xl">Cover Picture</h1>
          <label
            htmlFor="file"
            className="flex justify-between items-center mt-4 gap-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>

            <input
              type="file"
              name="file"
              onChange={handleImg}
              id="file"
              className="hidden"
            />
          </label>
          <div className="border-gray h-32 w-32 border border-gray-500">
            <img
              src={
                !tempFile
                  ? `${API_URL}/images/${blog?.image}`
                  : tempFile
              }
              alt=""
              className="w-full h-full"
            />
          </div>

          <button className="primary w-32" onClick={handleUpload}>
            Upload
          </button>
        </div>

        <div className="w-full">
          Select Category :
          <label htmlFor="category" className="p-4">
            <select
              name="category"
              defaultValue={"tech"}
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="outline-none p-4 bg-transparent"
            >
              {
              NavContent.slice(1).map((option) => <option className={optionClass} value={option?.category} key={option?.id} >{option?.link}</option>)
              }
            </select>
          </label>
        </div>
        <Editor
          placeholder={"Write a description"}
          value={desc}
          setValue={setDesc}
        />
        <div className="flex justify-between">
          <button
            onClick={handleCreate}
            className="primary-btn"
            disabled={!desc || isLoading || loading}
          >
            {id ? "Update" : "Create"}
          </button>
          <button
            className="secondary-btn"
            onClick={() => setPreview((prev) => !prev)}
          >
            Preview
          </button>
        </div>

        {preview && <div dangerouslySetInnerHTML={{ __html: desc }}></div>}
      </div>
    </>
  );
};

export default CreateBlog;
