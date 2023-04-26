import React, { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import {
  useUpdateUserMutation,
} from "../Features/users/userApiSlice";
import { ThemeContext } from "../context/ThemeContext";
import { API_URL } from "../config";


const EditProfile = ({ setOpenDrawer, userInfo }) => {
  const { id, username: name } = useAuth();
  const [file, setFile] = useState(userInfo?.avatar || "");
  const [tempFile, setTempFile] = useState("");
  const [username, setUsername] = useState(userInfo?.username || "");
  const [webLink, setWebLink] = useState(userInfo?.webLink || "");
  const [country, setCountry] = useState(userInfo?.country || "");
  const [bio, setBio] = useState(userInfo?.bio || "");
  const [worksAt, setWorksAt] = useState(userInfo?.worksAt || "");
  const className = "border bg-transparent border-blue-400 rounded-lg p-2 w-full";
  const {theme} = useContext(ThemeContext);
  const [updateUser, { isLoading, isSuccess}] =
    useUpdateUserMutation();


  const handleImg = (e) => {
    const img = e.target.files && e.target.files[0];
    setFile(img);

    const blob = new Blob([img], { type: img.type });
    setTempFile(URL.createObjectURL(blob));
  };
  
  const handleUpload = async () => {
    const data = new FormData();
    const fileName = Date.now() + file.name;
    
    data.append("file", file, fileName);
    try {
      fetch("${API_URL}/upload", {
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

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateUser({
      ...(file && { avatar: file }),
      id,
      username,
      webLink,
      country,
      bio,
      worksAt,
    });

    
  };

  

  useEffect(() => {
    if (isSuccess) {
      setOpenDrawer(false);
    }
  }, [isSuccess]);

  return (
    <>
      <form
        action=""
        onSubmit={handleUpdate}
        className={`${theme.primary} flex p-4 gap-4 flex-col`}
      >
        <div className="flex justify-between">
          <h1 className="text-center text-xl font-bold text-gray-400">
            Edit Profile
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            onClick={() => setOpenDrawer(false)}
            className="w-6 cursor-pointer h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className="flex gap-2">
          <input
            className={className}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            type="text"
            placeholder="Username"
            value={username}
          />

          <input
            className={className}
            onChange={(e) => setWebLink(e.target.value)}
            name="webLink"
            type="text"
            value={webLink}
            placeholder="Your Website link"
          />
        </div>

        <div className="flex gap-2">
          <input
            className={className}
            onChange={(e) => setCountry(e.target.value)}
            name="country"
            type="text"
            value={country}
            placeholder="Country"
          />
        </div>

        <textarea
          className={className}
          onChange={(e) => setBio(e.target.value)}
          name="bio"
          value={bio}
          placeholder="Bio"
        />

        <div className="flex gap-2">
          <input
            className={className}
            onChange={(e) => setWorksAt(e.target.value)}
            name="worksAt"
            type="text"
            value={worksAt}
            placeholder="Works At"
          />
        </div>
        <div className="flex justify-between gap-4">
          <label htmlFor="file" className="flex   mt-4 gap-4">
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
          <div className="border-gray h-16 w-16 border border-gray-500">
            <img
              src={
                tempFile ||
                `${API_URL}/images/${userInfo?.avatar}` ||
                ""
              }
              alt=""
              className="w-full h-full"
            />
          </div>

          <button type="button" className="primary w-32" onClick={handleUpload}>
            Upload
          </button>
        </div>

        <button
          disabled={isLoading}
          className="success w-1/2 mx-auto mt-4 mb-2"
        >
          Edit
        </button>
      </form>
    </>
  );
};

export default EditProfile;
