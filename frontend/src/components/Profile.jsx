import React, { useRef, useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AtSign, Heart, ImageIcon, MessageCircle, VideoIcon, Volume2, VolumeX } from 'lucide-react'
import axios from 'axios';
import { toast } from 'sonner'
import { setUserProfile } from '@/redux/authSlice.js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'; // Import dialog components

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const dispatch = useDispatch()
  const [activeTab,setActiveTab] =useState("posts")
  const [muted, setMuted] = useState(true);
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({}); // Use useRef to store video references
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [dialogData, setDialogData] = useState([]); // State to store followers or following data
  const [dialogHeading, setDialogHeading] = useState(""); // State to store dialog heading

  const {userProfile, user} = useSelector(store=>store.auth)
  
  const isLoggedInProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const handleTabChange = (tab) =>{
   setActiveTab(tab)
   setPlayingVideo(null); // Stop any playing video when switching tabs
  }

  const handleVideoClick = (postId) => {
    const videoElement = videoRefs.current[postId];

    if (playingVideo === postId) {
      videoElement?.pause();
      setPlayingVideo(null);
    } else {
      videoElement?.play();
      setPlayingVideo(postId);
    }
  };

  const toggleMute = (postId) => {
    const videoElement = videoRefs.current[postId];
    if (videoElement) {
      videoElement.muted = !muted; // Toggle mute
      setMuted(!muted); // Update state
    }
  };

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `https://clickzap-1.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,
        {},
        { withCredentials: true }
      );
  
      if (res.data.success) {
        const updatedProfile = {
          ...userProfile,
          followers: isFollowing
            ? userProfile.followers.filter((id) => id !== user._id)
            : [...userProfile.followers, user._id],
        };

        dispatch(setUserProfile(updatedProfile)); // Updating global state
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      toast.error("Something went wrong!");
    }
  };
  
  const handleDialogOpen = async (type) => {
    try {
      setDialogHeading(type === "followers" ? "Followers" : "Following"); // Set heading dynamically
      const res = await axios.get(
        `https://clickzap-1.onrender.com/api/v1/user/${userProfile._id}/${type}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setDialogData(res.data.users); // Set the fetched user details
      } else {
        setDialogData([]); // No data to display
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load data!");
      setDialogData([]);
    }
    setDialogOpen(true);
  };

  const handleViewProfile = () => {
    setDialogOpen(false); // Close dialog box
  };
  
  const displayedPost = activeTab === 'posts' 
  ? userProfile?.posts 
  : activeTab === 'saved' 
    ? userProfile?.bookmarks 
    : activeTab === 'reels' 
      ? userProfile?.posts?.filter(post => post?.media[0]?.type === "video") 
      : [];


  return (
    <div className='flex max-w-5xl justify-center mx-auto pl-10 mobile:mt-[15%] tablet:ml-[20%]'>
      <div className='flex flex-col gap-20 p-8 mobile:gap-10 tablet:gap-10'>
        <div className='grid grid-cols-2 mobile:grid-cols-1 mobile:gap-6 tablet:grid-cols-1 tablet:gap-6'>
          <section className='flex justify-center items-center'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={userProfile?.profilePicture} alt='profile picture'/>
              <AvatarFallback className='text-3xl'>
              {userProfile?.username
                ? userProfile.username.split(" ").map(name => name[0]).join("").toUpperCase() 
                : "U"}
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5 tablet:ml-[15%]'>
              <div className='flex items-center gap-2 mobile:flex-col '>
                <span>{userProfile?.username}</span>
                {
                  isLoggedInProfile ?(
                <>
                  <Link to='/account/edit'><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                  <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                  {/* <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button> */}
                </>
                  ):(
                    isFollowing ? (
                      <>
                      <Button variant='secondary' className='h-8' onClick={handleFollowOrUnfollow}>Unfollow</Button>
                      <Link to='/chat'><Button variant='secondary' className='h-8'>Message</Button></Link>
                      </>
                    ):(
                      <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8 rounded-lg' onClick={handleFollowOrUnfollow}>Follow</Button>
                    )
                  )
                }
              </div>
              <div className='flex items-center gap-3'>
                <p> <span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
                <p
                  className='cursor-pointer'
                  onClick={() => handleDialogOpen('followers')}
                >
                  <span className='font-semibold'>{userProfile?.followers.length}</span> followers
                </p>
                <p
                  className='cursor-pointer'
                  onClick={() => handleDialogOpen('following')}
                >
                  <span className='font-semibold'>{userProfile?.following.length}</span> following
                </p>
              </div>
              <div className='flex flex-col gap-3'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'><AtSign className='w-5'/> <span className='pl-1'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('saved')}>
              SAVED
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('reels')}>
                REELS
            </span>
            {/* <span className={`py-3 cursor-pointer ${activeTab === 'tags' ? 'font-bold' : ''}`} onClick={()=>handleTabChange('tags')}>
              TAGS
            </span> */}
          </div>
          <div className='grid grid-cols-3 gap-1 mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 laptop:ml-[20%]'>
            {
              displayedPost?.map((post) => {
                const mediaType = Array.isArray(post?.media) && post?.media[0]?.type; // Safeguard added
                const isVideo = mediaType === "video";
                return (
                  <div key={post?._id} className='relative group cursor-pointer laptop:w-[100%]'>
                    {
                      isVideo ? (
                        <div className="relative">
                        <video
                          ref={(el) => { if (el) videoRefs.current[post._id] = el; }}
                          src={post?.media[0]?.url}
                          className="rounded-sm my-2 w-full aspect-square object-cover"
                          muted={muted} // Mute state applied
                        />
                        <div className="absolute inset-0 flex flex-col gap-2 items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => handleVideoClick(post._id)} className="text-white text-2xl">
                            {playingVideo === post._id ? "⏸" : "▶️"}
                          </button>
                          <div className='flex items-center text-white space-x-4'>
                            <button className='flex items-center gap-2 hover:text-gray-300'>
                              <Heart/>
                              <span>{post?.likes.length}</span>
                            </button>
                            <button className='flex items-center gap-2 hover:text-gray-300'>
                              <MessageCircle/>
                              <span>{post?.comments.length}</span>
                            </button>
                          </div>
                        </div>
                        <button onClick={() => toggleMute(post._id)} className="absolute bottom-2 right-2 text-white bg-black/50 rounded-full p-1 w-8 h-8 flex items-center justify-center">
                          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                      </div>
                    ) : (
                      Array.isArray(post?.media) && post?.media[0]?.url && ( // Safeguard added
                        <div className="relative">
                          <img
                            src={post?.media[0]?.url}
                            alt="post"
                            className="rounded-sm my-2 w-full aspect-square object-cover"
                          />
                          <ImageIcon className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 w-6 h-6" />
                        </div>
                      )
                    )
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mobile:max-w-xs">
          <DialogHeader>
            <DialogTitle>{dialogHeading}</DialogTitle> {/* Use dynamic heading */}
          </DialogHeader>
          <div className='flex flex-col gap-4 '>
            {dialogData.map((profile) => (
              <div key={profile._id} className='flex items-center justify-between '>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={profile.profilePicture} alt='profile picture' />
                    <AvatarFallback>{profile.username[0]}</AvatarFallback>
                  </Avatar>
                  <span>{profile.username}</span>
                </div>
                <Link to={`/profile/${profile._id}`}>
                  <Button onClick={handleViewProfile} variant='secondary' className='hover:bg-gray-200 h-8'>View Profile</Button>
                </Link>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Profile