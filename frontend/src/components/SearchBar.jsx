import React, { useState, useEffect } from 'react'
import Textfield from '@atlaskit/textfield'

export default function SearchBar({ onChange, placeholder='Search...' }){
  const [v, setV] = useState('')
  useEffect(() => {
    const t = setTimeout(()=> onChange && onChange(v), 300)
    return () => clearTimeout(t)
  }, [v, onChange])
  return <Textfield value={v} onChange={(e)=>setV(e.target.value)} placeholder={placeholder} />
}
