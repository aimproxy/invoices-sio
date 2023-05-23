import type {AppProps} from 'next/app'
import '../styles/globals.css'
import {Inter} from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function App({Component, pageProps}: AppProps) {
    return (
        <div className={`${inter.className} font-sans`}>
            <Component {...pageProps} />
        </div>
    )
}
