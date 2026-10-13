import { Html, Head, Main, NextScript } from 'next/document';
import salonSchema from '../data/salon-schema.json';
import { THEME_BOOT } from '../lib/themeBoot';
import { CONSENT_BOOT } from '../lib/consent';

export default function Document() {
  return (
    <Html lang="el">
      <Head>
        {/* Google Analytics μόνο μετά από «Αποδοχή» στο μήνυμα cookies (src/lib/consent.js) */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_BOOT }} />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo512.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#12100e" />
        {/* Λευκό θέμα την ημέρα, σκούρο τη νύχτα (ώρα της συσκευής). Πριν τα CSS, για να μην αναβοσβήνει. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,300;1,9..144,500&family=Manrope:wght@400;500;700;800&display=swap"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(salonSchema) }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
