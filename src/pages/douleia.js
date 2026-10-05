import React from 'react';
import { PageSeo, SITE } from '../components/Seo';
import View from '../views/Careers';

// Google για Θέσεις Εργασίας: η αγγελία εμφανίζεται στις αναζητήσεις «ζητείται βοηθός κομμωτηρίου»
const jobPosting = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Βοηθός κομμωτηρίου',
  description: '<p>Ψάχνουμε βοηθό κομμωτηρίου με όρεξη για δουλειά και εκπαίδευση, σε οικογενειακό κομμωτήριο στο Θησείο που λειτουργεί από το 1992.</p><ul><li>Σταθερή εργασία</li><li>Εκπαίδευση στη δουλειά, με L’Oréal Professionnel και Redken</li><li>Η εμπειρία είναι πλεονέκτημα αλλά όχι απαραίτητη</li></ul>',
  datePosted: '2026-10-03',
  hiringOrganization: { '@type': 'Organization', name: 'Alexandros Hair Salon', sameAs: `${SITE}/`, logo: `${SITE}/logo512.png` },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress', streetAddress: 'Ερυσίχθονος 3-5', addressLocality: 'Αθήνα',
      addressRegion: 'Αττική', postalCode: '11851', addressCountry: 'GR'
    }
  },
  industry: 'Κομμωτική',
  occupationalCategory: '39-5012.00 Hairdressers, Hairstylists, and Cosmetologists',
  experienceRequirements: { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: 0 },
  directApply: true,
  url: `${SITE}/douleia`
};

export default function Page(props) {
  return (
    <>
      <PageSeo path="/douleia" jsonld={jobPosting} />
      <View {...props} />
    </>
  );
}
