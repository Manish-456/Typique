import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Editor from "./Editor";
import { useCreateCommentMutation, useEditCommentMutation } from "../Features/blog/blogApiSlice";
import { SocketContext } from "../context/socketContext";

const Comment = ({ blogId, clientId, setEdit, edit, commentDetail, title, authorId }) => {
  const [value, setValue] = useState("");
  const {socket} = useContext(SocketContext)
  const [createComment] = useCreateCommentMutation();
  const [editComment] = useEditCommentMutation();
 useEffect(() => {
  if(commentDetail && edit){
    setValue(commentDetail?.text)
  }else{
    setValue("")
  }

 }, [edit, commentDetail])
  const handleComment = async () => {
    const payload = {
      blogId: blogId,
      authorId,
      title,
      clientId,
      isLiked: false,
    };
  if(edit){
    try{
      await editComment({...commentDetail, text : value});
      
      setEdit(false);
      
    }catch(err){}
   
  }else{
    try {
      await createComment({ ...payload, text : value });
         socket?.emit("send-notification", payload)
       } catch (error) {
   
       }
  }
  };
 
  return (
    <div className="bg-transparent">
      <Editor
        value={value}
        setValue={setValue}
        placeholder={"Write your opinion"}
      />

      <button onClick={handleComment} className="primary mt-10 ">
        {edit ? "Edit" : "POST"}
      </button>
    </div>
  );
};

export default Comment;
