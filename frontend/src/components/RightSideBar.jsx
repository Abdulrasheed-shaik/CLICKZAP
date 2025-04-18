import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSideBar = () => {
  const {user} = useSelector(store => store.auth)
  return (
    <div className='w-fit my-10 pr-32 fixed right-0 mobile:hidden tablet:hidden laptop:pr-9'>
      <div className='flex items-center gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here......'}</span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  )
}

export default RightSideBar