import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Contact';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/hours" />
      <View {...props} />
    </>
  );
}
