import React from 'react';
import Seo from '../../components/Seo';
import ShopShell from '../../shop/ShopApp';
import Diagnosis from '../../shop/pages/Diagnosis';

export default function DiagnosisPage({ language, setLanguage }) {
  return (
    <>
      <Seo
        path="/shop/diagnosi"
        title="Διάγνωση μαλλιών: η ρουτίνα L’Oréal Professionnel που σου ταιριάζει | Alexandros Hair Salon"
        description="Τρεις ερωτήσεις για τα μαλλιά σου και βλέπεις τη ρουτίνα της L’Oréal Professionnel βήμα προς βήμα. Alexandros Hair Salon, Θησείο."
      />
      <ShopShell language={language} setLanguage={setLanguage}>
        {() => <Diagnosis lang={language} />}
      </ShopShell>
    </>
  );
}
