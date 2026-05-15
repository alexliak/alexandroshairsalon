// Προϊόντα EVOQUE & Gotstyle — από τιμολόγια cosmeso.gr (Μάιος 2026)
// Για να αλλάξεις εικόνα: βάλε το αρχείο στο public/images/products/ και άλλαξε το πεδίο image
const products = [

  // ─── SMART KERATIN ───────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'EVOQUE Smart Keratin Σαμπουάν 380ml',
    nameEn: 'EVOQUE Smart Keratin Shampoo 380ml',
    description: 'Σαμπουάν με κερατίνη για λείανση και αναδόμηση. Ιδανικό για σγουρά και αφύσικα μαλλιά. Αποκαθιστά την ελαστικότητα και τη λάμψη.',
    descriptionEn: 'Keratin shampoo for smoothing and restructuring. Ideal for curly and frizzy hair. Restores elasticity and shine.',
    price: 22.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 2,
    name: 'EVOQUE Smart Keratin Conditioner 380ml',
    nameEn: 'EVOQUE Smart Keratin Conditioner 380ml',
    description: 'Conditioner κερατίνης για βαθιά ενυδάτωση και αναδόμηση. Ξεμπλέκει εύκολα, αφήνει τα μαλλιά απαλά και διαχειρίσιμα.',
    descriptionEn: 'Keratin conditioner for deep hydration and restructuring. Detangles easily, leaving hair soft and manageable.',
    price: 17.50,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 3,
    name: 'EVOQUE Smart Keratin Μάσκα 500ml',
    nameEn: 'EVOQUE Smart Keratin Mask 500ml',
    description: 'Εντατική μάσκα κερατίνης για βαθιά αναδόμηση και λείανση. Αποκαθιστά την ελαστικότητα, μειώνει το φριζάρισμα.',
    descriptionEn: 'Intensive keratin mask for deep restructuring and smoothing. Restores elasticity and reduces frizz.',
    price: 40.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 4,
    name: 'EVOQUE Smart Keratin Λάδι Περιποίησης 90ml',
    nameEn: 'EVOQUE Smart Keratin Hair Care Oil 90ml',
    description: 'Λάδι περιποίησης με κερατίνη για λάμψη και προστασία από τη θερμότητα. Δαμάζει τα σγουρά και αφύσικα μαλλιά.',
    descriptionEn: 'Hair care oil with keratin for shine and heat protection. Tames frizzy and unruly hair.',
    price: 24.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 5,
    name: 'EVOQUE Smart Keratin Frizz Control 235ml',
    nameEn: 'EVOQUE Smart Keratin Frizz Control 235ml',
    description: 'Λοσιόν ελέγχου φριζαρίσματος με κερατίνη. Διατηρεί τα μαλλιά λεία και υπάκουα όλη μέρα.',
    descriptionEn: 'Keratin frizz control lotion. Keeps hair smooth and obedient all day long.',
    price: 24.50,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },

  // ─── MINI SMART KERATIN ───────────────────────────────────────────────────────
  {
    id: 6,
    name: 'EVOQUE Mini Smart Keratin Σαμπουάν 100ml',
    nameEn: 'EVOQUE Mini Smart Keratin Shampoo 100ml',
    description: 'Ταξιδιωτικό μέγεθος σαμπουάν κερατίνης. Ιδανικό για ταξίδια — όλες οι ιδιότητες της σειράς Smart Keratin σε μικρό μέγεθος.',
    descriptionEn: 'Travel size keratin shampoo. Ideal for trips — all Smart Keratin properties in a compact size.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },
  {
    id: 7,
    name: 'EVOQUE Mini Smart Keratin Conditioner 100ml',
    nameEn: 'EVOQUE Mini Smart Keratin Conditioner 100ml',
    description: 'Ταξιδιωτικό μέγεθος conditioner κερατίνης. Ιδανικό για ταξίδια — βαθιά ενυδάτωση σε μικρό μέγεθος.',
    descriptionEn: 'Travel size keratin conditioner. Ideal for trips — deep hydration in a compact size.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },
  {
    id: 8,
    name: 'EVOQUE Mini Smart Keratin 2-Phase 100ml',
    nameEn: 'EVOQUE Mini Smart Keratin 2-Phase 100ml',
    description: 'Ταξιδιωτικό μέγεθος 2-φάσεων κερατίνης. Ξεμπλέκει, ενυδατώνει και προστατεύει χωρίς ξέπλυμα.',
    descriptionEn: 'Travel size 2-phase keratin leave-in. Detangles, hydrates and protects without rinsing.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },

  // ─── BLONDE & PURPLE ─────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'EVOQUE Blonde Purple Μάσκα 250ml',
    nameEn: 'EVOQUE Blonde Purple Mask 250ml',
    description: 'Μάσκα με μωβ χρωστικές για ξανθά, γκρίζα και αποχρωματισμένα μαλλιά. Εξουδετερώνει τους κίτρινους τόνους, χαρίζει λαμπερό αποτέλεσμα.',
    descriptionEn: 'Purple pigment mask for blonde, grey and bleached hair. Neutralizes yellow tones for a bright, cool result.',
    price: 19.00,
    image: '',
    category: 'Blonde & Purple',
    inStock: true
  },
  {
    id: 10,
    name: 'EVOQUE Blonde Purple 2-Phase 400ml',
    nameEn: 'EVOQUE Blonde Purple 2-Phase 400ml',
    description: 'Αμπούλα 2 φάσεων για ξανθά μαλλιά. Ξεμπλέκει, ενυδατώνει και διατηρεί ζωντανό το χρώμα. Χωρίς ξέπλυμα.',
    descriptionEn: 'Leave-in 2-phase conditioner for blonde hair. Detangles, hydrates and keeps color vibrant. No rinsing needed.',
    price: 20.00,
    image: '',
    category: 'Blonde & Purple',
    inStock: true
  },

  // ─── STYLING ─────────────────────────────────────────────────────────────────
  {
    id: 11,
    name: 'EVOQUE Pomade Matte Look No4 100ml',
    nameEn: 'EVOQUE Pomade Matte Look No4 100ml',
    description: 'Πομάδα με ματ αποτέλεσμα και δυνατό κράτημα. Για σύγχρονα ανδρικά χτενίσματα με φυσικό φινίρισμα.',
    descriptionEn: 'Matte pomade with strong hold. For modern men\'s hairstyles with a natural finish.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 12,
    name: 'EVOQUE Pomade Shine No5 100ml',
    nameEn: 'EVOQUE Pomade Shine No5 100ml',
    description: 'Πομάδα με γυαλιστερό αποτέλεσμα και μέτριο-δυνατό κράτημα. Λάμψη, ορισμός και στυλ.',
    descriptionEn: 'Shine pomade with medium-strong hold. Gloss, definition and style.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 13,
    name: 'EVOQUE Creamy Matte Strong Hold No3 100ml',
    nameEn: 'EVOQUE Creamy Matte Strong Hold No3 100ml',
    description: 'Κρεμώδης πομάδα με ματ φινίρισμα και πολύ δυνατό κράτημα. Ιδανική για δύσκολα χτενίσματα.',
    descriptionEn: 'Creamy pomade with matte finish and very strong hold. Ideal for challenging hairstyles.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 14,
    name: 'EVOQUE Hair Butter 150ml',
    nameEn: 'EVOQUE Hair Butter 150ml',
    description: 'Βούτυρο μαλλιών με θρεπτικά έλαια για βαθιά ενυδάτωση και μαλακό κράτημα. Για μαλλιά που χρειάζονται θρέψη.',
    descriptionEn: 'Hair butter with nourishing oils for deep hydration and soft hold. For hair that needs extra nourishment.',
    price: 14.50,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 15,
    name: 'EVOQUE Forming Cream 150ml',
    nameEn: 'EVOQUE Forming Cream 150ml',
    description: 'Κρέμα φορμαρίσματος για φυσικό κράτημα και ορισμό. Κατάλληλη για όλους τους τύπους μαλλιών.',
    descriptionEn: 'Forming cream for natural hold and definition. Suitable for all hair types.',
    price: 15.00,
    image: '',
    category: 'Styling',
    inStock: true
  },

  // ─── MILK THERAPY ────────────────────────────────────────────────────────────
  {
    id: 16,
    name: 'EVOQUE Milk Therapy Silky Serum 90ml',
    nameEn: 'EVOQUE Milk Therapy Silky Serum 90ml',
    description: 'Ορός μεταξιού με γαλακτοπρωτεΐνες για λάμψη, ενυδάτωση και μεταξένιο αποτέλεσμα. Καταπολεμά το φριζάρισμα.',
    descriptionEn: 'Silk serum with milk proteins for shine, hydration and a silky result. Fights frizz.',
    price: 24.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 17,
    name: 'EVOQUE Milk Therapy Creamy Mousse 200ml',
    nameEn: 'EVOQUE Milk Therapy Creamy Mousse 200ml',
    description: 'Κρεμώδης αφρός μαλλιών με γαλακτοπρωτεΐνες. Κράτημα, ενυδάτωση και ορισμός για υγιή, λαμπερά μαλλιά.',
    descriptionEn: 'Creamy hair mousse with milk proteins. Hold, hydration and definition for healthy, shiny hair.',
    price: 14.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 18,
    name: 'EVOQUE Creamy Milk Μάσκα 500ml',
    nameEn: 'EVOQUE Creamy Milk Mask 500ml',
    description: 'Κρεμώδης μάσκα με γαλακτοπρωτεΐνες για βαθιά αναδόμηση, ενυδάτωση και απαλό αποτέλεσμα.',
    descriptionEn: 'Creamy mask with milk proteins for deep restructuring, hydration and a soft result.',
    price: 39.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 19,
    name: 'EVOQUE Mini Creamy Milk Μάσκα 50ml',
    nameEn: 'EVOQUE Mini Creamy Milk Mask 50ml',
    description: 'Ταξιδιωτικό μέγεθος της αγαπημένης μάσκας Creamy Milk. Βαθιά αναδόμηση και ενυδάτωση σε μικρό μέγεθος.',
    descriptionEn: 'Travel size of the beloved Creamy Milk Mask. Deep restructuring and hydration in a compact size.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },

  // ─── HEALTH CARE ─────────────────────────────────────────────────────────────
  {
    id: 20,
    name: 'EVOQUE Healthy Care Color Lock Mousse 200ml',
    nameEn: 'EVOQUE Healthy Care Color Lock Mousse 200ml',
    description: 'Αφρός κλειδώματος χρώματος για προστασία της βαφής. Διατηρεί τη ζωντάνια των χρωμάτων και ενισχύει τη λάμψη.',
    descriptionEn: 'Color lock mousse for dye protection. Keeps color vibrant and enhances shine.',
    price: 16.00,
    image: '',
    category: 'Health Care',
    inStock: true
  },
  {
    id: 21,
    name: 'EVOQUE Healthy Care Color Lock 2850ml',
    nameEn: 'EVOQUE Healthy Care Color Lock 2850ml',
    description: 'Επαγγελματική μεγάλη συσκευασία 2850ml Color Lock για σαλόνια. Ιδανική για επαγγελματική χρήση — προστατεύει τη βαφή και διατηρεί ζωντανά τα χρώματα.',
    descriptionEn: 'Professional 2850ml Color Lock for salons. Ideal for professional use — protects dye and keeps colors vibrant.',
    price: 58.00,
    image: '',
    category: 'Health Care',
    inStock: true
  },

  // ─── ΠΑΙΔΙΚΑ ─────────────────────────────────────────────────────────────────
  {
    id: 22,
    name: 'Gotstyle Παιδικό Τζελ Μαλλιών 250ml',
    nameEn: 'Gotstyle For Kids Hair Gel 250ml',
    description: 'Παιδικό τζελ μαλλιών με ήπια σύνθεση. Ασφαλές για παιδιά, χωρίς σκληρά χημικά. Εύκολο ξέπλυμα.',
    descriptionEn: 'Kids hair gel with gentle formula. Safe for children, free from harsh chemicals. Easy to rinse out.',
    price: 7.50,
    image: '',
    category: 'Παιδικά',
    inStock: true
  }

];

export default products;
