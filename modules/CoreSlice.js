import { createSlice } from '@reduxjs/toolkit'

export const CoreSlice = createSlice({
  name: 'Core',
  initialState: {
    os: 'Not known',
    browser: 'Not known',
    url: '',
  },
  reducers: {
    setNavg: (state, action) => {
      state.os = action.payload.os;
      state.browser = action.payload.browser;
      state.url = action.payload.url;
    }
  }
})

export const { setNavg } = CoreSlice.actions

export const os = state => state.Core.os
export const browser = state => state.Core.browser
export const url = state => state.Core.url

export default CoreSlice.reducer