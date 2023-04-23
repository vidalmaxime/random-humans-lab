import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
      :root {
        --space-grotesk-font: ${spaceGrotesk.style.fontFamily};
      }
    `}
      </style>
      <Component {...pageProps} />
    </>

  );
}
