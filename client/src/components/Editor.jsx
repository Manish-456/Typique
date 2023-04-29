import JoditEditor from 'jodit-react'
import React, {useContext, useMemo } from 'react'
import { ThemeContext } from '../context/ThemeContext'


const Editor = ({placeholder, value, setValue}) => {
       
       const {themes} = useContext(ThemeContext)
    
    const config =
        useMemo(() => ({
          readonly : false,
          placeholder : placeholder || "Start typing",
 
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
