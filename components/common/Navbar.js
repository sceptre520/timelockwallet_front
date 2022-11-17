import React from "react";

import { ConnectWallet } from "../core/ConnectWallet";

export const Navbar = () => {
  return (
    <>
      <div className="flex justify-between p-2 px-4 md:px-8 lg:px-16 bg-th-background-secondary border-b border-slate-700">
        <div className="flex items-center">
        </div>

        <div className="flex items-center">
          <div className="border border-th-accent-medium p-2 px-4 rounded-lg hover:border-th-accent-light text-white">
            <ConnectWallet></ConnectWallet>
          </div>
        </div>
      </div>

      
    </>
  )
}