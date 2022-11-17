export const rpcs = {
  bsc: {
    chainId: '0x38', // 56
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com']
  }
}


import Web3 from 'web3';
import { covertDecimal } from './decimal';
import { abi as ERC20ABI } from './abi/ERC20.json'
import { abi as TLW_ABI } from './abi/Timelockwallet.json'
export const getTokenAllowance = async(tokenAddress, owner, spender) => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var tokenContract = new w3.eth.Contract(ERC20ABI, tokenAddress);
    var cb = await tokenContract.methods.allowance(owner,spender).call()
    var allowance = covertDecimal(cb, 18, 'toNum');
    return allowance;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export const getTokenBalance = async(tokenAddress, owner) => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    if (tokenAddress == '0') {
      var cb = await w3.eth.getBalance(owner)
      var balance = covertDecimal(cb, 18, 'toNum');
      return balance;
    }
    else {
      var tokenContract = new w3.eth.Contract(ERC20ABI, tokenAddress);
      var cb = await tokenContract.methods.balanceOf(owner).call()
      var balance = covertDecimal(cb, 18, 'toNum');
      return balance;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export const getTotalWithdrawLen = async(account) => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var twlContract = new w3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
    var cb = await twlContract.methods.getWithdrawLength(account).call()
    return cb;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export const getRecentWithdrawLen = async(account) => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var twlContract = new w3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
    var cb = await twlContract.methods.getRecentWithdrawLength(account).call()
    return cb;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export const getWithdrawInfo = async(account, index) => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var twlContract = new w3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
    var cb = await twlContract.methods.getWithdrawInfo(account, index.toString()).call()
    return cb;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export const getWithdrawDuration = async() => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var twlContract = new w3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
    var cb = await twlContract.methods.withdrawDuration().call()
    return cb;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export const getWthdrawLimitation = async() => {
  try {
    var w3 = new Web3(rpcs['bsc'].rpcUrls[0]);
    var twlContract = new w3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
    var cb = await twlContract.methods.withdrawLimitation().call()
    var limit = covertDecimal(cb, 18, 'toNum');
    return limit;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

const getNonce = async (account) => {
  var web3 = new Web3(rpcs['bsc'].rpcUrls[0]);
  var nonce = await web3.eth.getTransactionCount(account, 'latest');
  return '0x' + Number(nonce).toString(16);
}
export const approve = async (tokenaddress, owner, spender, amount) => {
  const nonce = await getNonce(owner);

  var web3 = new Web3(rpcs['bsc'].rpcUrls[0]);
  var tokenContract = new web3.eth.Contract(ERC20ABI, tokenaddress);
  if (amount == null) {
    amount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
  }
  var [gas, gasPrice, data] = await Promise.all([
    tokenContract.methods.approve(spender, amount).estimateGas({from:owner}),
    web3.eth.getGasPrice(),
    tokenContract.methods.approve(spender, amount).encodeABI()
  ]);
  gas = Math.round(Number(gas) * 1.1);
  gasPrice = Math.round(Number(gasPrice) * 1.1);
  return { 
    from: owner,
    to: tokenaddress,
    data: data,
    gas: '0x'+gas.toString(16),
    gasPrice: '0x'+gasPrice.toString(16),
    value: '0x0',
    nonce: nonce
  }
}

export const deposit = async (tokenaddress, owner, amount) => {
  const nonce = await getNonce(owner);

  amount = covertDecimal(amount, 18, 'toBN');
  var web3 = new Web3(rpcs['bsc'].rpcUrls[0]);
  var twlContract = new web3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
  var [gas, gasPrice, data] = await Promise.all([
    twlContract.methods.deposit(tokenaddress, amount).estimateGas({from:owner}),
    web3.eth.getGasPrice(),
    twlContract.methods.deposit(tokenaddress, amount).encodeABI()
  ]);
  gas = Math.round(Number(gas) * 1.1);
  gasPrice = Math.round(Number(gasPrice) * 1.1);
  return { 
    from: owner,
    to: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
    data: data,
    gas: '0x'+gas.toString(16),
    gasPrice: '0x'+gasPrice.toString(16),
    value: '0x0',
    nonce: nonce
  }
}

export const withdraw = async (tokenaddress, owner, amount) => {
  const nonce = await getNonce(owner);

  amount = covertDecimal(amount, 18, 'toBN');
  var web3 = new Web3(rpcs['bsc'].rpcUrls[0]);
  var twlContract = new web3.eth.Contract(TLW_ABI, process.env.NEXT_PUBLIC_WALLET_ADDRESS);
  var [gas, gasPrice, data] = await Promise.all([
    twlContract.methods.withdraw(tokenaddress, amount).estimateGas({from:owner}),
    web3.eth.getGasPrice(),
    twlContract.methods.withdraw(tokenaddress, amount).encodeABI()
  ]);
  gas = Math.round(Number(gas) * 1.1);
  gasPrice = Math.round(Number(gasPrice) * 1.1);
  return { 
    from: owner,
    to: process.env.NEXT_PUBLIC_WALLET_ADDRESS,
    data: data,
    gas: '0x'+gas.toString(16),
    gasPrice: '0x'+gasPrice.toString(16),
    value: '0x0',
    nonce: nonce
  }
}
