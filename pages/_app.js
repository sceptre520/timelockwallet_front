import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

import store from '../modules/store'

function getLibrary(provider) {
  return new Web3Provider(provider)
}

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </Web3ReactProvider>
    </Provider>
  );
}

export default MyApp
