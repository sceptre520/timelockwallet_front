import React from 'react';
import { useTheme } from 'next-themes';

import { Navbar } from "./../components/common/Navbar"
import { DetectBrowser } from "./../components/core/DetectBrowser"
import { Pool } from "./../components/stake/Pool"
import { StakeBoard } from "./../components/stake/StakeBoard"

export default function Home() {
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setTheme('dark');
  }, []);

  return (
    <>
      <DetectBrowser></DetectBrowser>

      <Navbar></Navbar>
    
      <div className='container px-2 mx-auto mt-8'>
        
        <div className="w-full mt-8">
          <Pool></Pool>
        </div>

        <div className="w-full mt-8">
          <StakeBoard></StakeBoard>
        </div>
      </div>
    </>
  )
}
