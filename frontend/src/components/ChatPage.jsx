import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { setSelectedUser } from '@/redux/authSlice.js'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageCircleCode } from 'lucide-react'
import Messages from './Messages'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice.js'

const ChatPage = () => {
  const [textMessage,setTextMessage] =useState("")
  const {user, suggestedUsers, selectedUser} = useSelector(store=>store.auth)
  const {onlineUsers,messages} = useSelector(store=>store.chat)

  
  const dispatch = useDispatch()

  const sendMessageHandler = async (receiverId) =>{
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`,{textMessage},{
        headers:{
          "Content-Type":'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        dispatch(setMessages([...messages,res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    return ()=>{
      dispatch(setSelectedUser(null))
    }
  },[])
  return (
    <div className='flex ml-[16%] h-screen'>
      <section className={`w-1/4 my-8 mobile:w-[200%] tablet:w-[100%] ${selectedUser ? 'mobile:hidden tablet:hidden' : ''}`}>
        <h1 className='font-bold mb-4 px-3 text-xl tablet:ml-[20%]'>{user?.username}</h1>
        <hr className='mb-4 border-gray-300 tablet:ml-[20%] tablet:w-full'/>
        <div className='overflow-y-auto h-[80vh] mobile:h-[90vh] tablet:ml-[20%]'>
          {
            suggestedUsers.map((suggestedUser,index)=>{
              const isOnline =onlineUsers.includes(suggestedUser?._id)
              return (
                <div key={suggestedUser?.id || index} onClick={()=>dispatch(setSelectedUser(suggestedUser))} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer'>
                  <Avatar className='w-14 h-14'>
                    <AvatarImage src={suggestedUser?.profilePicture}/>
                    <AvatarFallback>AR</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='font-medium'>{suggestedUser?.username}</span>
                    <span className={`text-xs font-bold ${isOnline? 'text-green-600':'text-red-600'}`}>{isOnline ? 'online' : 'offline'}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </section>
      {
        selectedUser ? (
          <section className='flex-1 border-l-gray-300 flex flex-col h-full mobile:h-[80%] mobile:mt-[25%] mobile:w-screen mobile:-ml-8 tablet:ml-[11%]'>
            <div className='flex gap-2 items-center px-3 border-b border-gray-300 sticky top-0 bg-white z-10 mobile:h-[10%]'>
              <Avatar className='my-4'>
                <AvatarImage src={selectedUser?.profilePicture} alt='profile'/>
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
              <div className='flex items-center p-4 border-t border-t-gray-300'>
                <span className='flex flex-col font-semibold'>
                  {selectedUser?.username}
                </span>
              </div>
              {/* Back button for mobile view */}
              <Button  variant='secondary'
                onClick={() => dispatch(setSelectedUser(null))} 
                className='ml-auto  mobile:block tablet:block hidden'
              >
                Back
              </Button>
            </div>
            <Messages selectedUser={selectedUser}/>
            <div className='flex items-center p-4 border-t border-t-gray-300 mobile:h-[1%] mobile:p-0'>
              <Input value={textMessage} onChange={(e)=> setTextMessage(e.target.value)} type='text' className='flex-1 mr-2 focus-visible:ring-transparent rounded-3xl mobile:mt-[15%]' placeholder='Messages.....'/>
              <Button onClick={()=>sendMessageHandler(selectedUser?._id)} className='rounded-3xl mobile:mt-[15%]'>Send</Button>
            </div>
          </section>
        ) : (
          <div className='flex flex-col items-center justify-center mx-auto mobile:hidden tablet:hidden'>
            <MessageCircleCode className='w-32 h-32 my-4'/>
            <h1 className='font-medium text-xl'>Your messages</h1>
            <span>Send a message to start a chat </span>
          </div>
        )
      }
    </div>
  )
}

export default ChatPage