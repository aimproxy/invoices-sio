import type {AppProps} from 'next/app'
import '../styles/globals.css'
import {Inter} from 'next/font/google';
import {Hydrate, QueryClient, QueryClientProvider,} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import React, {useState} from "react";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const ReactQueryDevtoolsProduction = React.lazy(() =>
    import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
        (d) => ({
            default: d.ReactQueryDevtools,
        }),
    ),
)

export default function App({Component, pageProps}: AppProps) {
    const [queryClient] = useState(() => new QueryClient())
    const [showDevtools, setShowDevtools] = React.useState(true)

    React.useEffect(() => {
        // @ts-ignore
        window.toggleDevtools = () => setShowDevtools((old) => !old)
    }, [])
    return (
        <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
                <div className={`${inter.className} font-sans`}>
                    <Component {...pageProps} />
                </div>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen/>
            {showDevtools && (
                <React.Suspense fallback={null}>
                    <ReactQueryDevtoolsProduction/>
                </React.Suspense>
            )}
        </QueryClientProvider>
    )
}
