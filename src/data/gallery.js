// Φωτογραφίες του χώρου (public/images/salon/). Ονόματα αρχείων και alt γράφουν το όνομα του κομμωτηρίου
// και το Θησείο, ώστε η Google να δένει τις εικόνες με το σωστό κομμωτήριο.
// Επεξεργασία: λευκή ισορροπία, έκθεση, κάδρο. Οι οθόνες των υπολογιστών εμφανίζονται σβηστές.
// Τίποτα δεν προστέθηκε ή αφαιρέθηκε από τον χώρο.
import { SITE } from '../components/Seo';

const src = (name, w) => `/images/salon/alexandros-hair-salon-thiseio-${name}-${w}.webp`;

export const SALON_PHOTOS = [
  { name: 'eisodos', w: 1600, h: 1104,
    el: { alt: 'Η είσοδος του Alexandros Hair Salon στην Ερυσίχθονος 3-5, Θησείο', cap: 'Η είσοδος, Ερυσίχθονος 3-5' },
    en: { alt: 'Entrance of Alexandros Hair Salon at Erisichthonos 3-5, Thiseio, Athens', cap: 'The entrance, Erisichthonos 3-5' } },
  { name: 'xoros', w: 1600, h: 1104,
    el: { alt: 'Ο χώρος του Alexandros Hair Salon στο Θησείο: θέσεις κομμωτικής και υποδοχή', cap: 'Ο χώρος και η υποδοχή' },
    en: { alt: 'Inside Alexandros Hair Salon in Thiseio: styling stations and reception', cap: 'The salon and reception' } },
  { name: 'kathreftes', w: 1600, h: 1446,
    el: { alt: 'Θέσεις κουρέματος με διπλούς καθρέφτες στο Alexandros Hair Salon, Θησείο', cap: 'Θέσεις κουρέματος' },
    en: { alt: 'Cutting stations with double mirrors at Alexandros Hair Salon, Thiseio', cap: 'Cutting stations' } },
  { name: 'reception', w: 1600, h: 1135,
    el: { alt: 'Υποδοχή του Alexandros Hair Salon με προϊόντα L’Oréal Professionnel', cap: 'Υποδοχή & προϊόντα L’Oréal Professionnel' },
    en: { alt: 'Reception of Alexandros Hair Salon with L’Oréal Professionnel products', cap: 'Reception & L’Oréal Professionnel products' } },
  { name: 'salonaki', w: 1600, h: 1143,
    el: { alt: 'Το κομμωτήριο Alexandros Hair Salon στο Θησείο, θέα προς τη βιτρίνα', cap: 'Προς τη βιτρίνα' },
    en: { alt: 'Alexandros Hair Salon in Thiseio, looking towards the front windows', cap: 'Towards the front windows' } },
  { name: 'anamoni', w: 1600, h: 1442,
    el: { alt: 'Χώρος αναμονής του Alexandros Hair Salon, Θησείο', cap: 'Χώρος αναμονής' },
    en: { alt: 'Waiting area at Alexandros Hair Salon, Thiseio', cap: 'Waiting area' } },
  { name: 'lousimo', w: 1600, h: 1722,
    el: { alt: 'Λουτήρες στο Alexandros Hair Salon, Θησείο', cap: 'Λούσιμο' },
    en: { alt: 'Backwash basins at Alexandros Hair Salon, Thiseio', cap: 'Backwash' } }
].map((p) => ({ ...p, src: src(p.name, 1600), small: src(p.name, 800), srcSet: `${src(p.name, 800)} 800w, ${src(p.name, 1600)} 1600w` }));

// schema.org: ImageGallery με ImageObject, για τη σελίδα /fotografies
export const GALLERY_LD = {
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  '@id': `${SITE}/fotografies#gallery`,
  name: 'Φωτογραφίες: Alexandros Hair Salon, Θησείο',
  url: `${SITE}/fotografies`,
  about: { '@id': `${SITE}/#salon` },
  image: SALON_PHOTOS.map((p) => ({
    '@type': 'ImageObject',
    contentUrl: `${SITE}${p.src}`,
    thumbnailUrl: `${SITE}${p.small}`,
    width: p.w,
    height: p.h,
    caption: p.el.alt,
    creditText: 'Alexandros Hair Salon',
    copyrightNotice: 'Alexandros Hair Salon',
    creator: { '@type': 'Organization', name: 'Alexandros Hair Salon' },
    contentLocation: { '@type': 'Place', name: 'Θησείο, Αθήνα' }
  }))
};
