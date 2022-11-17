import React from "react";
import Image from "next/image";

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from "@web3-react/injected-connector";

import { useDispatch, useSelector } from 'react-redux';
import { walletactive, walletaddress, setWallet } from './../../modules/WalletSlice';
import { os, browser, url } from './../../modules/CoreSlice';
import { rpcs } from "./../../constant/web3";

import useStorage from './../../modules/hook.ts';

export const ConnectWallet = () => {
  const dispatch = useDispatch();
  const rdxwalletactive = useSelector(walletactive);
  const rdxwalletaddress = useSelector(walletaddress);
  const rdxos = useSelector(os);
  const rdxbroswer = useSelector(browser);
  const rdxurl = useSelector(url);

  const { getItem, setItem, removeItem } = useStorage();
  const { activate, deactivate } = useWeb3React();
  const { active, chainId, account, library } = useWeb3React();
  const Injected = new InjectedConnector({});

  const walletTypeIndicator = 'ach_stake_wallettype';
  const walletType = ['Metamask'];

  const [walletSelectDlg, setWalletSelectDlg] = React.useState(false);

  const onConnectWallet = React.useCallback(() => {
    if (rdxos != 'Others' && rdxos != 'Linux OS' || ((rdxos == 'Others' || rdxos == 'Linux OS')&&window.ethereum)) {
      if (active) {
        deactivate();
        removeItem(walletTypeIndicator)
      }
      else {
        activate(Injected);
      }
    }
    else {
      window.location.href = 'https://metamask.app.link/dapp/'+rdxurl;
    }
    // setWalletSelectDlg(true);
  }, [rdxos, rdxbroswer, rdxurl, active, rdxwalletactive]);

  React.useEffect(() => {
    if (active) {
      dispatch(setWallet({
        active: active,
        type: walletType[0],
        address: account
      }));
      setItem(walletTypeIndicator, walletType[0]);
      var const_chainid = Number(rpcs['bsc'].chainId);
      if (const_chainid != chainId) {
        library.provider.request({
          method: 'wallet_addEthereumChain',
          params: [rpcs['bsc']]
        })
        .then((cb) => {
          console.log(cb)
        })
        .catch((err) => {
          console.log(err)
        });
      }
    }
    else {
      dispatch(setWallet({
        active: false,
        type: '',
        address: ''
      }));
    }
  }, [active, chainId, account, library]);

  React.useEffect(() => {
    var cookie_wallettype = getItem(walletTypeIndicator);

    if (cookie_wallettype == walletType[0]) {
      activate(Injected);
    }
  }, []);

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={() => onConnectWallet()}
      >
        {rdxwalletactive?
          <>
            <AccountBalanceWalletIcon className="text-md mr-3"></AccountBalanceWalletIcon>
            {rdxwalletaddress.substr(0,5)+'...'+rdxwalletaddress.substr(-4)}
          </>
        :
          <>
            <LockOpenIcon className="text-md mr-3"></LockOpenIcon>
            Connect Wallet
          </>
        }
      </div>

      <Dialog onClose={() => setWalletSelectDlg(false)} open={walletSelectDlg}>
        <DialogContent className="bg-slate-800">
          <div className="absolute top-0 right-0 p-1 cursor-pointer hover:bg-slate-400 rounded-full" onClick={() => setWalletSelectDlg(false)}>
            <CloseIcon className="text-white"></CloseIcon>
          </div>
          <div className="w-80 max-h-[24rem] ml-2 mt-4 px-1 overflow-y-auto flex flex-wrap justify-between items-center">
            <div className="w-full h-20 flex items-center my-2 cursor-pointer hover:bg-slate-700 bg-slate-200/10 rounded-lg p-2"
              onClick={() => connectMetamask()}
            >
              <div className="w-16 h-16 mr-2">
                <Image
                  src='/wallet/metamask.png'
                  width={200}
                  height={200}
                  layout="responsive"
                ></Image>
              </div>
              <div className="text-center text-white text-lg">Metamask</div>
            </div>
            <div className="w-full h-20 flex items-center my-2 cursor-pointer hover:bg-slate-700 bg-slate-200/10 rounded-lg p-2"
              onClick={() => connectWalletconnect()}
            >
              <div className="w-16 h-16 mr-2">
                <Image
                  src='/wallet/walletConnectIcon.svg'
                  width={200}
                  height={200}
                  layout="responsive"
                ></Image>
              </div>
              <div className="text-center text-white text-lg">WalletConnect</div>
            </div>
            <div className="w-full h-20 flex items-center my-2 cursor-pointer hover:bg-slate-700 bg-slate-200/10 rounded-lg p-2"
              onClick={() => connectCoinbase()}
            >
              <div className="w-16 h-16 mr-2">
                <Image
                  src='/wallet/coinbase.png'
                  width={200}
                  height={200}
                  layout="responsive"
                ></Image>
              </div>
              <div className="text-center text-white text-lg">Coinbase Wallet</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
