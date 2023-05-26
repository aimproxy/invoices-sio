import type {AppProps} from 'next/app'
import '../styles/globals.css'
import {Inter} from 'next/font/google';
import {Hydrate, QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React, {useState} from "react";
import KpisProvider from "@sio/components/KpisProvider";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

export default function App({Component, pageProps}: AppProps) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <KpisProvider>
                    <div className={`${inter.className} font-sans`}>
                        <Component {...pageProps} />
                    </div>
                </KpisProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}
