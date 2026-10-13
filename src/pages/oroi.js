import React from 'react';
import { PageSeo } from '../components/Seo';
import Legal from '../views/Legal';

export default function Page(props) {
  return (
    <>
      <PageSeo path="/oroi" />
      <Legal doc="terms" {...props} />
    </>
  );
}
