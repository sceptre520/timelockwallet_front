import { createSlice } from '@reduxjs/toolkit'

export const WalletSlice = createSlice({
  name: 'Wallet',
  initialState: {
    walletactive: false,
    wallettype: '',
    walletaddress: ''
  },
  reducers: {
    setWallet: (state, action) => {
      state.walletactive = action.payload.active;
      state.wallettype = action.payload.type;
      state.walletaddress = action.payload.address;
    }
  }
})

export const { setWallet } = WalletSlice.actions

export const walletactive = state => state.Wallet.walletactive
export const wallettype = state => state.Wallet.wallettype
export const walletaddress = state => state.Wallet.walletaddress

export default WalletSlice.reducer