import React from 'react'
import assets, { userDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function LeftsideBar({selectedUser, setSelectedUser}) {
    const navigate = useNavigate()
  return (
    <div className={`bg-[#818582]/10 h-full p-5 rounded-r-xl overflow-y-scroll 
    text-white ${selectedUser ? "max-md:hidden" :  ''}`}> {/*if user is selected then hide sidebar & show only chat container on small screen*/}
        <div className='pb-5'>
            <div className='flex justify-between items-center'>
                <img src={assets.logo} alt='logo' className='max-w-40 ' />
                <div className='relative py-2 group'>  {/*we are wrapping  the menu icon & the dropdown menu(child) in a div(parent) and applying the group class to it(group is a Tailwind helper that lets parent control child styling. means When I get 
                hovered (current parent div) my children(divs inside me) can change too). This allows us to show the dropdown menu when the user hovers over the menu icon cuz we are technically also hovering on parent div
 */}
                    <img src={assets.menu_icon} alt='Menu' className='max-w-5 cursor-pointer' />
                    <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
                    bg-[#282142] border border-gray-600 text-gray-100 hidden
                    group-hover:block'> {/*parent div is relative & this dropdown div is absolue means "Position relative to parent" So dropdown appears under menu icon, not somewhere random. & hidden here means the dropdown is hidden but 
                                           when we hover on img (we are technically also hovering on parent div) the dropdown appears we added group-hover:block here so when we hover one image dropdown appears & stays but if we add the css to img tag 
                                           the dropdown will go away resulting in bad UI. group-hover:block means: When parent (group) is hovered → make this element visible (display: block)*/}
                        <p onClick={()=>navigate('/profile')}
                            className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className='my-2 border-t border-gray-500' />
                        <p className='cursor-pointer text-sm'>Logout</p>
                    </div>
                </div> 
            </div>

                            {/*this is search box */}
            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                <img src={assets.search_icon} alt="Search" className='w-4'/>
                <input type="text" className='bg-transparent border-none outline-none text-white text-xs 
                placeholder-[#c8c8c8] flex-1' placeholder='Search User...' />
            </div>   
        </div>

        {/*user list.. loops through the users */}
        {/* 
        <div>
        {userDummyData.map((user, index) => ( //we are looping through the dummy data of users & showing them. For each user get user, index & return a div with userinfo.
            <div 
                onClick={() => setSelectedUser(user)} //since we looping through the users (a,b,c), each user gets its own on click. if i click on user 'b' then setSelectedUser(b)
                key={index}
                className={`${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`} //then this line checks if the user === selected one.. if selectedUser is b then we loop 
                //through the user list & when we find b we apply bg color to it. This is how we show which user is selected                >
                <img src={user?.profilePic || assets.avatar_icon} alt="" /> //if user has profile pic show it otherwise show default avatar icon

                    <div> //from here this is dummy logic ffs this was the reason why i wrote this without css ffs...means if index is less than 3 (first 3 users) show online otherise show offline
                        <p>{user.fullName}</p>
                        {
                        index < 3 
                        ? <span>Online</span> 
                        : <span>Offline</span>
                        }
                    </div>

                {index > 2 && <p>{index}</p>} //index is less than 2 [a,b,c,d,e]. oh my lord this following a tutorial logic is so bad.. here it should be how many msgs are unread.. wow 

            </div>
        ))}
        </div>

        FLOW:
            Click User
            ↓
            setSelectedUser(user)
            ↓
            selectedUser updated
            ↓
            React re-renders
            ↓
            Matching user highlighted
        */}
        
<div className='flex flex-col'>
            {userDummyData.map((user, index )=>(
                <div onClick={()=>{setSelectedUser(user)}}
                key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer 
                max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt=""
                    className='w-[35px] aspect-[1/1] rounded-full' />
                    <div className='flex flex-col leading-5'>
                        <p>{user.fullName}</p>
                        {
                            index < 3
                            ? <span className='text-green-400 text-xs'>Online</span>
                            : <span className='text-neutral-400 text-xs'>Offline</span>
                        }
                    </div>
                    {index > 2 && <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center 
                    rounded-full bg-violet-500/50'>{index}</p>}
                </div>
            ) )}
        </div>

    </div>
  )
}

export default LeftsideBar