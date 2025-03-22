import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, Menu, X } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice.js'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice.js'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Logo from './Logo'
import { setMessageNotification } from '@/redux/rtnSlice.js'
import SearchBox from './SearchBox'; // Import the SearchBox component

const LeftSideBar = () => {
  const navigate = useNavigate()
  const { user } = useSelector(store => store.auth);
  const { likeNotification, messageNotification } = useSelector(store => store.realTimeNotification)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to control SearchBox dialog
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  // Track unread notifications
  const [hasUnreadLikeNotifications, setHasUnreadLikeNotifications] = useState(likeNotification.length > 0);
  const [hasUnreadMessageNotifications, setHasUnreadMessageNotifications] = useState(messageNotification.length > 0);

  useEffect(() => {
    setHasUnreadLikeNotifications(likeNotification.length > 0);
  }, [likeNotification]);

  useEffect(() => {
    console.log("Current message notifications:", messageNotification); // Debugging
    setHasUnreadMessageNotifications(messageNotification.length > 0);
  }, [messageNotification]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/user/logout`, { withCredentials: true })
      if (res.data.success) {
        dispatch(setAuthUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))
        navigate('/login')
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sideBarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
    } else if (textType === 'Profile') {
      navigate(`/profile/${user?._id}`);
    } else if (textType === 'Home') {
      navigate('/');
    } else if (textType === 'Messages') {
      navigate('/chat');
      dispatch(setMessageNotification([]));
    } else if (textType === 'Explore') {
      navigate('/explore');
    } else if (textType === 'Search') {
      setIsSearchOpen(true); // Open the SearchBox dialog
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sideBarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    {
      icon: (
        <div className='relative'>
          <MessageCircle />
          {hasUnreadMessageNotifications && (
            <span className='absolute -top-2 -right-2 rounded-full h-5 w-5 flex items-center justify-center bg-red-600 text-white text-xs'>
              {messageNotification.length}
            </span>
          )}
        </div>
      ),
      text: "Messages"
    },
    {
      text: "Notifications",
      render: () => (
        <Popover>
          <PopoverTrigger asChild>
            <div
              className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg my-3 relative'
              onClick={() => setHasUnreadLikeNotifications(false)}
            >
              <Heart />
              <span>Notifications</span>
              {hasUnreadLikeNotifications && (
                <span className='absolute -top-2 left-4 rounded-full h-5 w-5 flex items-center justify-center bg-red-600 text-white text-xs'>
                  {likeNotification.length}
                </span>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className='tablet:ml-2 mobile:ml-[40%]'>
            <div className='tablet:ml-2'>
              {likeNotification.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                likeNotification.map((notification) => (
                  <div key={notification.userId} className='flex items-center gap-2 py-3'>
                    <Avatar>
                      <AvatarImage src={notification.userDetails?.profilePicture} />
                      <AvatarFallback>AR</AvatarFallback>
                    </Avatar>
                    <p className='text-sm'>
                      <span className='font-bold'>{notification.userDetails?.username} </span>
                      liked your post
                    </p>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      )
    },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className='w-6 h-6'>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile"
    },
    { icon: <LogOut />, text: "Logout" },
  ]

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen mobile:h-[10%] tablet:w-[24%] mobile:w-full mobile:shadow-md mobile:bg-gray-50'>
      <div className='flex flex-col mobile:flex-row mobile:justify-between'>
        <h1 className='my-8 text-xl tablet:my-1'><Logo /></h1>
        <div className='mobile:hidden'> {/* Sidebar for larger screens */}
          {sideBarItems.map((item, index) => (
            <div 
              key={index} 
              className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3 mobile:text-[15px] tablet:text-[14px] tablet:my-1'
              onClick={() => item.text !== "Notifications" && sideBarHandler(item.text)}
            >
              {item.render ? item.render() : (
                <>
                  {item.icon}
                  <span>{item.text}</span>
                </>
              )}
            </div>
          ))}
        </div>
        <div className='hidden mobile:block mobile:mt-[5%]'> {/* Hamburger menu for mobile */}
          <button onClick={toggleSidebar} className='p-2'>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          <div
            className={`fixed top-0 left-0 z-20 bg-white h-full w-[70%] shadow-lg transform transition-transform duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className='p-4'>
              {sideBarItems.map((item, index) => (
                <div 
                  key={index} 
                  className='flex items-center gap-3 hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                  onClick={() => {
                    setIsSidebarOpen(false); // Close sidebar on item click
                    item.text !== "Notifications" && sideBarHandler(item.text);
                  }}
                >
                  {item.render ? item.render() : (
                    <>
                      {item.icon}
                      <span>{item.text}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      <SearchBox isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} /> {/* Render SearchBox */}
    </div>
  )
}

export default LeftSideBar
