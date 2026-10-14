import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Photos';
import { GALLERY_LD } from '../data/gallery';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/fotografies" jsonld={GALLERY_LD} />
      <View {...props} />
    </>
  );
}
