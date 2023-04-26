import JoditEditor from 'jodit-react'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../context/ThemeContext';

const Editor = ({placeholder, value, setValue}) => {
       
       const {theme} = useContext(ThemeContext)
    const config =
        useMemo(() => ({
          readonly : false,
          placeholder : placeholder || "Start typing"
        
          }), [value])
    
 return (
  <JoditEditor
  className="bg-white dark:bg-black text-black dark:text-white border-gray-400 dark:border-gray-800 rounded-md p-4 shadow-md"
  value={value}
  config={config}
  tabIndex={1}
  onBlur={val => setValue(val)}
  onChange={newContent => {}}
/>

 )
}

export default Editor
