import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className=' my-8 flex flex-col items-center w-full mobile:mt-[25%] mobile:mx-8 tablet:ml-[25%]'>
        <Posts/>
    </div>
  )
}

export default Feed