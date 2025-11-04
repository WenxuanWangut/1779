import React from 'react'
import Pagination from '@atlaskit/pagination'
export default function P({ page=1, total=1, onChange }){
  const pages = Array.from({length: total}, (_,i)=>i+1)
  return <Pagination pages={pages} value={page} onChange={(e, p)=>onChange && onChange(p)} />
}
