import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessage from '@/hooks/useGetAllMessage';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser }) => {
    useGetRTM();
    useGetAllMessage();
    
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className='overflow-y-auto flex-1 p-4'>
            {/* User Profile Section */}
            <div className='flex justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <Avatar className='h-20 w-20'>
                        <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                        <AvatarFallback>
                        {selectedUser?.username
                ? selectedUser.username.split(" ").map(name => name[0]).join("").toUpperCase() 
                : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <span>{selectedUser?.username}</span>
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <Button variant='secondary' className='h-8 my-4'>View Profile</Button>
                    </Link>
                </div>
            </div>

            {/* Messages List */}
            <div className='flex flex-col gap-3'>
                {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                        <div className={`flex ${msg?.senderId === user?._id ? 'justify-end' : 'justify-start'}`} key={msg._id}>
                            
                            {/* Render Text Messages Only */}
                            {msg.message && (
                                <div className={`p-2 rounded-lg max-w-xs break-words ${msg?.senderId === user?._id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    <p>{msg.message}</p>
                                </div>
                            )}

                            {/* Render Instagram-like Post */}
                            {msg.post && msg.post.media?.length > 0 && (
                                <div className="border rounded-md bg-white text-black shadow-md max-w-sm tablet:max-w-xs mobile:max-w-3xs laptop:max-w-xs">
                                    {/* <div className="p-3 flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                            <AvatarFallback>AR</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold">{selectedUser?.username}</span>
                                    </div> */}

                                    {/* Display Post Media */}
                                    {msg.post.media.map((media, index) => (
                                        media.type === "image" ? (
                                            <img key={index} src={media.url} alt="Shared Post" className="w-full rounded-lg mobile:w-[80%] mobile:mx-auto" />
                                        ) : (
                                            <video key={index} controls className="w-full rounded-lg tablet:w-[90%] mobile:w-[80%] tablet:mx-auto mobile:mx-auto">
                                                <source src={media.url} type="video/mp4" />
                                            </video>
                                        )
                                    ))}

                                    {/* Post Caption */}
                                    <div className="p-3">
                                        <p className="text-sm">{msg.post.caption || "No caption"}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </div>
        </div>
    );
};

export default Messages;
