import React, { useState } from 'react'

const DepartmentButton = ({ departmentName, index, active, setActive }) => {
  
  return (
    <div className='m-1'>
        <button className={`h-8 w-auto p-3 font-serif rounded-sm ${active === index ?  'bg-amber-900 text-white' : 'bg-red-100 text-gray-800'  }`} onClick={()=>{
            setActive(index)
        }}>
            {departmentName}
        </button>
    </div>
  )
}

export default DepartmentButton