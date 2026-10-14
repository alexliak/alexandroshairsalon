import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { trackPageView } from '../utils/analytics';
import CookieBanner from '../components/CookieBanner';
import '../styles/global.css';
import '../styles/home.css';
import '../styles/shop.css';
import '../styles/diagnosis.css';
import '../styles/mathart.css';
import '../styles/theme-light.css';

export default function App({ Component, pageProps }) {
  // Μία γλώσσα για όλο το site: ελληνικά από προεπιλογή. Η επιλογή «EN» κρατιέται στη συσκευή
  // (ίδιο κλειδί με τις στατικές σελίδες), ώστε μια σελίδα προϊόντος που ανοίγει από σύνδεσμο ή νέα
  // καρτέλα να μένει στα αγγλικά.
  const [language, setLanguageState] = useState('el');
  const router = useRouter();
  useEffect(() => {
    try { if (localStorage.getItem('ahs-lang') === 'en') setLanguageState('en'); } catch (e) { /* ιδιωτική περιήγηση */ }
  }, []);
  const setLanguage = (next) => {
    setLanguageState((prev) => {
      const v = typeof next === 'function' ? next(prev) : next;
      try { localStorage.setItem('ahs-lang', v); } catch (e) { /* ιδιωτική περιήγηση */ }
      return v;
    });
  };
  useEffect(() => { document.documentElement.lang = language; }, [language]);

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
      <CookieBanner language={language} />
    </>
  );
}
