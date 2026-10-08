import React from 'react';
import { PageSeo } from '../components/Seo';
import View, { MODELS_FAQ_LD } from '../views/Models';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/montela" jsonld={MODELS_FAQ_LD} />
      <View {...props} />
    </>
  );
}
