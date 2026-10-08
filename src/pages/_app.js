import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { trackPageView } from '../utils/analytics';
import '../styles/global.css';
import '../styles/home.css';
import '../styles/shop.css';
import '../styles/diagnosis.css';
import '../styles/mathart.css';
import '../styles/theme-light.css';

export default function App({ Component, pageProps }) {
  // One language for the whole visit (Greek by default, like before)
  const [language, setLanguage] = useState('el');
  const router = useRouter();

  useEffect(() => {
    const onDone = (url) => trackPageView(url.split('?')[0]);
    router.events.on('routeChangeComplete', onDone);
    return () => router.events.off('routeChangeComplete', onDone);
  }, [router.events]);

  const page = <Component {...pageProps} language={language} setLanguage={setLanguage} />;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {page}
    </>
  );
}
