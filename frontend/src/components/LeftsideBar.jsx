import React from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'

function LeftsideBar({selectedUser, setSelectedUser}) {
    const navigate = useNavigate()
  return (
    <div>
        <div className='pb-5'>
            <div className='flex justify-between item-center'>
                <img src={assets.logo} alt='logo' className='max-w-40 ' />
                <div className='relative py-2 group'>  {/*we are wrapping  the menu icon & the dropdown menu in a div and applying the group class to it(group is a Tailwind helper that lets parent control child styling. means When I get hovered (current parent div) my children(divs inside me) can change too). This allows us to show the dropdown menu when the user hovers over the menu icon */}
                    <img src={assets.menu_icon} alt='Menu' className='max-w-5 cursor-pointer' />
                    <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md
                    bg-[#282142] border border-gray-600 text-gray-100 hidden
                    group-hover:block'> {/*parent div is relative & this dropdown div is absolue means "Position relative to parent" So dropdown appears under menu icon, not somewhere random. & hidden here means the dropdown is hidden but 
                                           when we hover on image the dropdown appears we added group-hover:block here so when we hover one image dropdown appears & stays but if we add the css to img tag the dropdown will go away resulting in bad UI */}
                        <p onClick={()=>navigate('/profile')}
                            className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr className='my-2 border-t border-gray-500' />
                        <p className='cursor-pointer text-sm'>Logout</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default LeftsideBar