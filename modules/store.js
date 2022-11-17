import { configureStore } from '@reduxjs/toolkit'

import CoreSlice from './CoreSlice'
import WalletSlice from './WalletSlice'

export default configureStore({
  reducer: {
    Core:   CoreSlice,
    Wallet: WalletSlice
  }
})