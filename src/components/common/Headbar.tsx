import { useEffect, useState } from 'react'
import { RiMenu2Fill } from "react-icons/ri";


const Headbar = () => {
  const [greeting, setGreeting] = useState("Hi");

  const greet = () => {
    const now = new Date();
    const hours = now.getHours();
    if(hours<12) setGreeting('Good Morning');
    else if(hours>12 && hours<16) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }

  useEffect(() => {
    greet();
  },[])

  return (
    <div className=' z-10 flex justify-center items-center mb-6'>

      <div className='w-full flex flex-col md:flex-row md:justify-between md:items-center'>
        <div className='flex justify-between items-center'>
          <RiMenu2Fill size={27} className='inline md:hidden text-emerald-900 bg-emerald-900/5 p-1 rounded-md m-1'/>
          {true && <p className='text-right md:text-left text-lg md:text-xl font-semibold text-emerald-900 py-1.5 md:py-0'>{greeting}, Hemant M!</p>}
        </div>
        <div className='md:w-33/100 px-3 py-2 text-sm text-emerald-900/90 bg-white rounded-xl flex justify-center items-center '>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input type='text' placeholder='Wanna know where your penny went?' className='w-full h-full px-2 outline-none placeholder:text-emerald-900/60'/>
        {/* filter box */}
        <div className='bg-emerald-900/20 rounded-lg px-3 md:px-4 py-0.5 md:py-1'>
        Filters
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default Headbar
