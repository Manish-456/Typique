import JoditEditor from 'jodit-react'
import React, {useContext, useMemo } from 'react'
import { ThemeContext } from '../context/ThemeContext'


const Editor = ({placeholder, value, setValue}) => {
       
       const {themes} = useContext(ThemeContext)
       console.log(themes)
    const config =
        useMemo(() => ({
          readonly : false,
          placeholder : placeholder || "Start typing",
  
          style: {
            backgroundColor : `${themes === "light" ? "white" : "white"}`,
            color : `${themes === "light" ? "white" : "black"}`
        },
          }), [value])
    
 return (
  <JoditEditor
  
  value={value}
  config={config}
  tabIndex={1}
  onBlur={val => setValue(val)}
  onChange={newContent => {}}
/>

 )
}

export default Editor
