import React from 'react'
export default function EmptyState({ title='No Data', description='Try creating something new.' }){
  return <div className="center"><div><h3>{title}</h3><p>{description}</p></div></div>
}
