import React from "react";

import { getTokenBalance } from "./../../constant/web3";
import { availableTokens } from "./../../constant/tokens";

export const Pool = () => {
  const [pools, setPools] = React.useState([]);

  React.useEffect(() => {
    const run = async () => {
      const TLW_address = process.env.NEXT_PUBLIC_WALLET_ADDRESS;
      var funcs = [];
      for (var x in availableTokens) {
        funcs.push(getTokenBalance(availableTokens[x].address, TLW_address));
      }
      var ret = await Promise.all(funcs);
      var tmp = [];
      for (var x in availableTokens) {
        tmp.push({
          address: availableTokens[x].address,
          symbol: availableTokens[x].symbol,
          balance: ret[x]
        });
      }
      setPools(tmp);
    }

    run()
  }, []);

  return (
    <>
      <div className="w-full border border-slate-700 rounded-3xl p-6">
        <div className="text-4xl font-medium">TOTAL BALANCE</div>
        
        <div className="flex mt-4">
          {pools.map((item, index) =>
            <div
              key={index}
              className="m-2 border border-slate-700 rounded-2xl p-4 text-center"
              style={{minWidth:'10rem'}}
            >
              <div
                className="text-2xl"
              >{item.symbol}</div>
              <div
                className="text-3xl"
              >{item.balance}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
