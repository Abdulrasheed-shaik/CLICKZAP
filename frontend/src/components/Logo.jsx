import React from 'react'
import '../components/Logo.css'
const Logo = () => {
  return (
    <svg width="150" height="100" viewBox="0 0 300 100" className='mobile:w-[55%] mobile:-mt-[30%] tablet:-mt-[20%] tablet:mx-auto tablet:w-[80%]' xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="'Billabong', 'Caveat', cursive"
        fontSize="80"
        fill="#000000" // Solid black
      >
        ClickZap
      </text>
    </svg>
  )
}

export default Logo