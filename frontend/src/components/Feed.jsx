import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className=' my-8 flex flex-col items-center w-full mobile:mt-[25%] tablet:ml-[15%]'>
        <Posts/>
    </div>
  )
}

export default Feed