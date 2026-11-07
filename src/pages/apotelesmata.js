import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Results';
import WORK from '../data/work.json';

const SITE = 'https://alexandroshairsalon.gr';

// Google: συλλογή εικόνων + βίντεο, από την ίδια πηγή με τη σελίδα.
const LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${SITE}/apotelesmata#results`,
  name: 'Αποτελέσματα: αλλαγή χρώματος από μαύρο & διόρθωση χρώματος · Alexandros Hair Salon, Θησείο',
  url: `${SITE}/apotelesmata`,
  about: { '@id': `${SITE}/#salon` },
  hasPart: WORK.map((w) => (w.type === 'video'
    ? { '@type': 'VideoObject', name: w.el.title, description: w.el.desc, thumbnailUrl: `${SITE}${w.poster}`, contentUrl: `${SITE}${w.src}`, uploadDate: w.uploadDate }
    : { '@type': 'ImageObject', name: w.el.title, description: w.el.alt, contentUrl: `${SITE}/images/work/alexandros-hair-salon-thiseio-${w.id}-1200.webp`, width: w.w, height: w.h }))
};

export default function Page(props) {
  return (
    <>
      <PageSeo path="/apotelesmata" jsonld={LD} />
      <View {...props} />
    </>
  );
}
