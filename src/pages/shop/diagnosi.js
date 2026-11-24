import React from 'react';
import Seo from '../../components/Seo';
import ShopShell from '../../shop/ShopApp';
import Diagnosis from '../../shop/pages/Diagnosis';

export default function DiagnosisPage({ language, setLanguage }) {
  return (
    <>
      <Seo
        path="/shop/diagnosi"
        title="Διάγνωση μαλλιών: ποια ρουτίνα σας ταιριάζει | Alexandros Hair Salon"
        description="Τρεις ερωτήσεις για τα μαλλιά σας και βλέπετε τη ρουτίνα της L’Oréal Professionnel βήμα προς βήμα. Alexandros Hair Salon, Θησείο."
      />
      <ShopShell language={language} setLanguage={setLanguage}>
        {() => <Diagnosis lang={language} />}
      </ShopShell>
    </>
  );
}
