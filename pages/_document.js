import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/logo.png" />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/logo.png"
        />
      </Head>
      <body className={`bg-th-background`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}