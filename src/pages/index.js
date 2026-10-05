import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Home';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/" />
      <View {...props} />
    </>
  );
}
