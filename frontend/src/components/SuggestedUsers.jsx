import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setUserProfile } from '@/redux/authSlice.js'
import axios from 'axios'
import { toast } from 'sonner'

const SuggestedUsers = () => {
    const { suggestedUsers = [] } = useSelector(store => store.auth);
    const { userProfile, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    // Local state to manage filtered users
    const [localSuggestedUsers, setLocalSuggestedUsers] = useState(
        suggestedUsers.filter(suggestedUser => 
            !userProfile?.following?.includes(suggestedUser._id)
        )
    );

    const handleFollowOrUnfollow = async (suggestedUserId) => {
        try {
            const isFollowing = userProfile?.following?.includes(suggestedUserId); // Fixed logic
            const res = await axios.post(
                `https://clickzap-1.onrender.com/api/v1/user/followorunfollow/${suggestedUserId}`,
                {},
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedProfile = {
                    ...userProfile,
                    following: isFollowing
                        ? userProfile.following.filter((id) => id !== suggestedUserId)
                        : [...userProfile.following, suggestedUserId],
                };

                dispatch(setUserProfile(updatedProfile)); // Updating global state
                toast.success(res.data.message);

                // Remove the followed user from the local list
                setLocalSuggestedUsers(prevUsers =>
                    prevUsers.filter(user => user._id !== suggestedUserId)
                );
            } else {
                toast.error(res.data.message || "Failed to follow/unfollow.");
            }
        } catch (error) {
            console.error("Error following/unfollowing:", error.response || error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className='my-10 '>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All </span>
            </div>
            {
                localSuggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-3'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar className='w-8 h-8'>
                                        <AvatarImage src={user?.profilePicture} />
                                        <AvatarFallback>
                                        {user?.username
                                        ? user.username.split(" ").map(name => name[0]).join("").toUpperCase() 
                                        : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                                    </h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here......'}</span>
                                </div>
                            </div>
                            <span
                                className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'
                                onClick={() => handleFollowOrUnfollow(user._id)}
                            >
                                Follow
                            </span>
                        </div>
                    );
                })
            }
        </div>
    );
};

export default SuggestedUsers;