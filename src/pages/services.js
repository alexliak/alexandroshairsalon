import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Services';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/services" />
      <View {...props} />
    </>
  );
}
