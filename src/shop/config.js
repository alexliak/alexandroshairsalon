// Ρυθμίσεις e-shop. Ό,τι αλλάζει συχνά (τιμές, απόθεμα) ζει στο shop-data/prices.csv.

// Διεύθυνση του Cloudflare Worker (κριτικές τώρα, πληρωμές αργότερα).
// Μπαίνει στο build: REACT_APP_SHOP_API=https://shop-api.alexandroshairsalon.gr npm run build
export const SHOP_API = (process.env.REACT_APP_SHOP_API || '').replace(/\/$/, '');

// Προϊόντα χωρίς τιμή: true = φαίνονται με «Ρώτα τιμή», false = κρύβονται εντελώς.
export const SHOW_UNPRICED = true;

// Μέγιστη ποσότητα ανά προϊόν σε μία παραγγελία
export const MAX_QTY = 10;

// Αποστολή. courier: null = το κόστος επιβεβαιώνεται με email (μέχρι να κλείσει συμφωνία με courier).
export const SHIPPING = {
  pickup: 0,
  courier: null,
  freeOver: null
};

// Προσωρινός τρόπος πληρωμής μέχρι να ενεργοποιηθούν κάρτες/PayPal/Klarna (Stripe).
export const BANK = {
  holder: 'ΛΙΑΚΟΠΟΥΛΟΣ ΑΛΕΞΑΝΔΡΟΣ',
  accounts: [
    { bank: 'Eurobank', iban: 'GR51 0260 6390 0001 6020 0558 062' },
    { bank: 'Εθνική Τράπεζα', iban: 'GR55 0110 1620 0000 1620 0488 795' },
    { bank: 'CrediaBank', iban: 'GR14 0160 0670 0000 0008 5004 298' }
  ],
  irisAfm: '070233060',
  irisPhone: '6981319000',
  email: 'liakopoulosalex@gmail.com'
};

// EmailJS (ίδιο template με το παλιό shop)
export const EMAILJS = {
  service: 'service_nul8u7q',
  template: 'template_186w5q2',
  publicKey: 'XL7dj9dSLwxsDvNtb'
};

export const SITE = 'https://alexandroshairsalon.gr';
export const WHATSAPP = '306981319000';
