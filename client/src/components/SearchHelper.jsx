import React from 'react'
import {blogwithUserIdQuery } from '../Helper/BlogHelper'
import { Link } from 'react-router-dom';

const SearchHelper = ({blogId}) => {
    const {blog} = blogwithUserIdQuery(blogId);
    
 
  return (
    <Link to={`/explore/?blog=${blog?.title}`} >
     <h1 className='p-2 text-sm'>{blog?.title}</h1>

    </Link>
  )
}

export default SearchHelper
