import React from 'react';
import { PageSeo } from '../components/Seo';
import View from '../views/Models';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/montela" />
      <View {...props} />
    </>
  );
}
