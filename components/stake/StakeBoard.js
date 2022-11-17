import React from "react";
import { useWeb3React } from '@web3-react/core';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import CloseIcon from '@mui/icons-material/Close';

import { Selectoption } from "./../common/Selectoption";
import { availableTokenNames, availableTokens } from "./../../constant/tokens";
import { useSelector } from 'react-redux';
import { walletaddress } from './../../modules/WalletSlice';
import { getTokenAllowance, getTokenBalance, getTotalWithdrawLen, getRecentWithdrawLen, getWithdrawInfo, getWithdrawDuration, getWthdrawLimitation } from "./../../constant/web3";
import { approve, deposit, withdraw } from "./../../constant/web3";

import { covertDecimal } from "./../../constant/decimal";

export const StakeBoard = () => {
  const tokens = availableTokenNames;
  const rdxwalletaddress = useSelector(walletaddress);

  const { library } = useWeb3React();

  const [totalDeposit, setTotalDeposit] = React.useState(0);
  const [withAvailable, setWithAvailable] = React.useState(0);
  const [withDration, setWithDuration] = React.useState('');
  const [withLimitaion, setWithLimitaion] = React.useState(0);

  const [tokenBalance, setTokenBalance] = React.useState(0);
  const [tokenAllowance, setTokenAllowance] = React.useState(0);

  const [actionDlg, setActionDlg] = React.useState(false);
  const [actionMode, setActionMode] = React.useState('');
  const [actionToken, setActionToken] = React.useState(tokens[0]);
  const [actionAmount, setActionAmount] = React.useState(0);

  const [recentLogs, setRecentLogs] = React.useState([]);

  const actionNames = {
    0: "Enter an amount",
    1: "Approve",
    2: "Deposit",
    3: "Withdraw",
    4: "Exceed withdraw limiation",
    5: "Exceed token balance"
  }
  const renderMode = (_tokenBalance, _tokenAllowance, _withAvailable, _actionMode, _actionAmount) => {
    if (_actionAmount == 0) return 0;
    if (_actionMode == 'deposit') {
      if (_actionAmount > _tokenBalance) return 5;
      if (_actionAmount > _tokenAllowance) return 1;
      return 2;
    }
    else {
      if (_actionAmount > _withAvailable) return 4;
      return 3;
    }
  }

  const handleMainAction = React.useCallback((_tokenBalance, _tokenAllowance, _withAvailable, _actionMode, _actionAmount) => {
    var tokenAddress = ''
    for (var x in availableTokens) {
      if (availableTokens[x].symbol == actionToken) {
        tokenAddress = availableTokens[x].address;
        break;
      }
    }
    if (tokenAddress == '') return;
    var ret = renderMode(_tokenBalance, _tokenAllowance, _withAvailable, _actionMode, _actionAmount);

    const run = async(_ret, _token, _wallet, _amount, _library) => {
      var tx = null;
      if (_ret == 1) {
        tx = await approve(_token, _wallet, process.env.NEXT_PUBLIC_WALLET_ADDRESS, null);
      }
      else if (_ret == 2) {
        tx = await deposit(_token, _wallet, _amount);
      }
      else if (_ret == 3) {
        tx = await withdraw(_token, _wallet, _amount);
      }

      if (tx != null) {
        _library.provider.request({
          method: "eth_sendTransaction",
          params: [ tx ]
        }).then((cb) => {
          console.log(cb)
        })
        .catch((error) => {
          console.log(error)
        });
      }
    }
    run(ret, tokenAddress, rdxwalletaddress, _actionAmount, library)
  }, [actionToken, rdxwalletaddress, library]);

  const actionHandler = (mode) => {
    setActionMode(mode);
    setActionDlg(true);
  }

  const changeSelectedToken = (value) => {
    setActionToken(value);
  }

  const renderDuration = (sec) => {
    var hours = Math.ceil(sec / 3600);
    var mins = Math.ceil((sec % 3600) / 60);
    var secs = sec % 60;
    var str = '';
    if (hours > 0) {
      str += hours + 'HR'
    }
    if (mins > 0) {
      if (str != '') str += ' ';
      str += mins + 'MIN'
    }
    if (secs > 0) {
      if (str != '') str += ' ';
      str += secs + 'SEC'
    }
    return str;
  }

  React.useEffect(() => {
    if (rdxwalletaddress == '') {
      setTokenBalance(0);
      setTokenAllowance(0);
    }
    else {
      var tokenAddress = ''
      for (var x in availableTokens) {
        if (availableTokens[x].symbol == actionToken) {
          tokenAddress = availableTokens[x].address;
          break;
        }
      }
      if (tokenAddress == '') {
        setTokenBalance(0);
        setTokenAllowance(0);
      }
      else {
        const run = async() => {
          var [balance, allowance] = await Promise.all([
            getTokenBalance(tokenAddress, rdxwalletaddress),
            getTokenAllowance(tokenAddress, rdxwalletaddress, process.env.NEXT_PUBLIC_WALLET_ADDRESS)
          ])
          setTokenBalance(balance);
          setTokenAllowance(allowance);
        }
        run()
      }
      
    }
  }, [actionToken, rdxwalletaddress])

  React.useEffect(() => {
    if (rdxwalletaddress == '') {
      setTotalDeposit(0);
      setWithAvailable(0);
    }
    else {
      const run = async() => {
        var funcs = [
          getTokenBalance(process.env.NEXT_PUBLIC_WALLET_ADDRESS, rdxwalletaddress),
          getTotalWithdrawLen(rdxwalletaddress),
          getRecentWithdrawLen(rdxwalletaddress),
          getWithdrawDuration(),
          getWthdrawLimitation()
        ]
        var [lpBal, totalWiths, recentWiths, _withDuration, _withLimitation] = await Promise.all(funcs);
        setTotalDeposit(lpBal);
        setWithDuration(renderDuration(_withDuration));
        setWithLimitaion(_withLimitation);

        if (recentWiths > 0) {
          var funcs = [];
          for (var i=0; i<recentWiths; i++) {
            funcs.push(getWithdrawInfo(rdxwalletaddress, totalWiths-recentWiths+i+1))
          }
          var infos = await Promise.all(funcs);
          var sum = 0;
          var tmp = [];
          for (var x in infos) {
            var amount = infos[x].amount;
            amount = covertDecimal(amount, 18, 'toNum');
            sum += amount;
            tmp.push({
              amount: amount,
              createdAt: new Date(1000 * infos[x].createdAt)
            })
          }
          setRecentLogs(tmp);
        }
        else {
          setRecentLogs([]);
        }
        setWithAvailable(_withLimitation - sum > lpBal ? lpBal : _withLimitation - sum);
      }
      run();
    }
  }, [rdxwalletaddress])

  return (
    <>
      <div className="w-full border border-slate-700 rounded-3xl p-6">
        <div className="flex">
          <div className="mx-2 my-1 border border-slate-700 rounded-2xl p-4 text-center">
            <div>TOTAL DEPOSIT</div>
            <div className="-ml-3">
              <span className="mr-2">$</span>
              <span className="text-3xl">{totalDeposit}</span>
            </div>
          </div>

          <div className="mx-2 my-1 border border-slate-700 rounded-2xl p-4 text-center">
            <div>WITHFRAW AVAILABLE</div>
            <div className="-ml-3">
              <span className="mr-2">$</span>
              <span className="text-3xl">{withAvailable}</span>
            </div>
          </div>

          <div className="mx-2 my-1 border border-slate-700 rounded-2xl p-4 text-center">
            <div>WITHDRAW DURATION</div>
            <div className="">
              <span className="text-3xl">{withDration}</span>
            </div>
          </div>

          <div className="mx-2 my-1 border border-slate-700 rounded-2xl p-4 text-center">
            <div>WITHDRAW LIMITATION</div>
            <div className="-ml-3">
              <span className="mr-2">$</span>
              <span className="text-3xl">{withLimitaion}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div
            className="border border-slate-700 rounded-full text-xl font-medium mx-2 p-2 px-4 cursor-pointer hover:border-slate-600"
            onClick={() => actionHandler('deposit')}
          >Deposit</div>
          <div
            className="border border-slate-700 rounded-full text-xl font-medium mx-2 p-2 px-4 cursor-pointer hover:border-slate-600"
            onClick={() => actionHandler('withdraw')}
          >Withdraw</div>
        </div>
      </div>

      <div className="w-full border border-slate-700 rounded-3xl p-6 mt-6">
        <div>RECENT HISTORY</div>
        
        {recentLogs.map((item, index) => 
          <div
            key={index}
            className="flex border border-slate-700 rounded-2xl text-xl font-medium mx-2 my-1 p-2 px-4 cursor-pointer hover:border-slate-600"
          >
            <div className="w-32">${item.amount}</div>
            <div className="flex-grow">{item.createdAt.toGMTString()}</div>
          </div>
        )}
      </div>

      <Dialog onClose={() => setActionDlg(false)} open={actionDlg}>
        <DialogContent className="bg-slate-800">
          <div className="absolute top-0 right-0 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setActionDlg(false)}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="text-xl text-white border-b border-slate-600">{actionMode=='deposit'?'Deposit':'Withdraw'}</div>
          <div className="w-80 bg-slate-700 rounded-lg p-2 mt-2">
            <div className="flex justify-between text-slate-200">
              <div>{actionMode=='deposit'?'Deposit':'Withdraw'}</div>
              <div>
                <span>{actionMode=='deposit'?'Max':'Balance'}:</span>
                <span
                  className="ml-1 font-medium cursor-pointer hover:text-slate-400"
                  onClick={() => setActionAmount(tokenBalance)}
                >{tokenBalance}</span>
              </div>
            </div>
            <div className="flex my-3 mt-4 items-center">
              <div>
                <input
                  className="w-full text-2xl p-1 bg-transparent outline-none text-white"
                  placeholder="0.0"
                  type="number"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                ></input>
              </div>
              <div className="text-lg text-slate-100 mr-2 w-16 text-center">
                <Selectoption
                  options={tokens}
                  value={actionToken}
                  onChange={changeSelectedToken}
                ></Selectoption>
              </div>
            </div>
          </div>
          <div
            className="mt-4 mb-2 bg-blue-600 rounded-md text-center text-slate-200 text-xl p-2 cursor-pointer hover:bg-blue-500"
            onClick={() => handleMainAction(tokenBalance, tokenAllowance, withAvailable, actionMode, actionAmount)}
          >{actionNames[renderMode(tokenBalance, tokenAllowance, withAvailable, actionMode, actionAmount)]}</div>
        </DialogContent>
      </Dialog>
    </>
  )
}
