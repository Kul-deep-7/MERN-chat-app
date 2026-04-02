import React, { useState } from 'react'
import LeftsideBar from '../components/LeftsideBar'
import ChatContainer from '../components/ChatContainer'
import RightsideBar from '../components/RightsideBar'

const Home = () => {

  const[selectedUser, setSelectedUser] = useState(false)
  return (
  <>
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border-2 border-b-gray-600 rounded-2xl 
      overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 
      'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'} 
      `}>
        <LeftsideBar/>
        <ChatContainer/>
        <RightsideBar/>
      </div>
    </div>
    
  </>
  )
}

export default Home