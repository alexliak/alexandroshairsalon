// Προϊόντα EVOQUE & Gotstyle — από τιμολόγια cosmeso.gr (Μάιος 2026)
// Για να αλλάξεις εικόνα: βάλε το αρχείο στο public/images/products/ και άλλαξε το πεδίο image
const products = [

  // ─── SMART KERATIN ───────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'EVOQUE Smart Keratin Σαμπουάν 380ml',
    nameEn: 'EVOQUE Smart Keratin Shampoo 380ml',
    description: 'Επαγγελματικό σαμπουάν κερατίνης για φριζαρισμένα και σγουρά μαλλιά. Λειαίνει, αναδομεί και μειώνει το φριζάρισμα από την πρώτη χρήση. Ιδανικό για γυναίκες με δύσκολα, αφύσικα ή χημικά επεξεργασμένα μαλλιά.',
    descriptionEn: 'Professional keratin shampoo for frizzy and curly hair. Smooths, restructures and reduces frizz from the first use. Ideal for unruly, chemically treated or damaged hair.',
    price: 22.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 2,
    name: 'EVOQUE Smart Keratin Conditioner 380ml',
    nameEn: 'EVOQUE Smart Keratin Conditioner 380ml',
    description: 'Conditioner κερατίνης για βαθιά ενυδάτωση φριζαρισμένων και ταλαιπωρημένων μαλλιών. Ξεμπλέκει εύκολα, χαρίζει απαλότητα και διαχειρισιμότητα. Κατάλληλο για σγουρά, βαμμένα και αφυδατωμένα μαλλιά.',
    descriptionEn: 'Keratin conditioner for deep hydration of frizzy and damaged hair. Detangles easily, giving softness and manageability. Suitable for curly, coloured and dehydrated hair.',
    price: 17.50,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 3,
    name: 'EVOQUE Smart Keratin Μάσκα 500ml',
    nameEn: 'EVOQUE Smart Keratin Mask 500ml',
    description: 'Εντατική μάσκα μαλλιών με κερατίνη για φριζαρισμένα, σγουρά και ταλαιπωρημένα μαλλιά. Βαθιά αναδόμηση, μέγιστη ενυδάτωση και αντι-φριζ αποτέλεσμα που διαρκεί. Επαγγελματική φόρμουλα για χρήση στο σπίτι.',
    descriptionEn: 'Intensive keratin hair mask for frizzy, curly and damaged hair. Deep restructuring, maximum hydration and long-lasting anti-frizz result. Professional formula for home use.',
    price: 40.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 4,
    name: 'EVOQUE Smart Keratin Λάδι Περιποίησης 90ml',
    nameEn: 'EVOQUE Smart Keratin Hair Care Oil 90ml',
    description: 'Λάδι μαλλιών με κερατίνη για λάμψη και προστασία από τη θερμότητα (πιστολάκι, ισιωτική, μπούκλες). Δαμάζει το φριζάρισμα σε σγουρά και αφύσικα μαλλιά. Ελαφριά υφή που δεν λιπαίνει.',
    descriptionEn: 'Keratin hair oil for shine and heat protection (blow dryer, straightener, curler). Tames frizz in curly and unruly hair. Lightweight texture that does not grease.',
    price: 24.00,
    image: '',
    category: 'Smart Keratin',
    inStock: true
  },
  {
    id: 5,
    name: 'EVOQUE Smart Keratin Frizz Control 235ml',
    nameEn: 'EVOQUE Smart Keratin Frizz Control 235ml',
    description: 'Αντι-φριζ λοσιόν κερατίνης για φριζαρισμένα μαλλιά. Διατηρεί τα μαλλιά λεία, υπάκουα και χωρίς φριζάρισμα όλη μέρα ακόμα και σε υγρασία. Ιδανικό για καθημερινή χρήση σε σγουρά γυναικεία μαλλιά.',
    descriptionEn: 'Anti-frizz keratin lotion for frizzy hair. Keeps hair smooth, manageable and frizz-free all day even in humidity. Ideal for daily use on curly women\'s hair.',
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
    description: 'Ταξιδιωτικό σαμπουάν κερατίνης 100ml — ιδανικό για ταξίδια και αποσκευές καμπίνας. Όλη η δύναμη της κερατίνης κατά του φριζαρίσματος σε μικρό, πρακτικό μέγεθος.',
    descriptionEn: 'Travel keratin shampoo 100ml — ideal for travel and cabin luggage. Full anti-frizz keratin power in a compact, practical size.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },
  {
    id: 7,
    name: 'EVOQUE Mini Smart Keratin Conditioner 100ml',
    nameEn: 'EVOQUE Mini Smart Keratin Conditioner 100ml',
    description: 'Ταξιδιωτικό conditioner κερατίνης 100ml για ενυδάτωση και ξεμπλέκει σγουρών και φριζαρισμένων μαλλιών. Πρακτικό μέγεθος για αποσκευές καμπίνας.',
    descriptionEn: 'Travel keratin conditioner 100ml for hydration and detangling of curly and frizzy hair. Practical size for cabin luggage.',
    price: 5.50,
    image: '',
    category: 'Mini',
    inStock: true
  },
  {
    id: 8,
    name: 'EVOQUE Mini Smart Keratin 2-Phase 100ml',
    nameEn: 'EVOQUE Mini Smart Keratin 2-Phase 100ml',
    description: 'Ταξιδιωτικό 2-φάσεων leave-in κερατίνης 100ml. Ξεμπλέκει, ενυδατώνει και προστατεύει από το φριζάρισμα χωρίς ξέπλυμα. Ιδανικό για γυναίκες με σγουρά μαλλιά που ταξιδεύουν.',
    descriptionEn: 'Travel 2-phase leave-in keratin 100ml. Detangles, hydrates and protects against frizz without rinsing. Ideal for women with curly hair who travel.',
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
    description: 'Μάσκα με μωβ χρωστικές για ξανθά, γκρίζα και αποχρωματισμένα μαλλιά. Εξουδετερώνει τους κίτρινους και χρυσαφί τόνους, χαρίζει κρύο, λαμπερό αποτέλεσμα. Η πιο αποτελεσματική μάσκα για ξανθιές.',
    descriptionEn: 'Purple pigment mask for blonde, grey and bleached hair. Neutralizes yellow and golden tones for a cool, bright result. The most effective mask for blondes.',
    price: 19.00,
    image: '',
    category: 'Blonde & Purple',
    inStock: true
  },
  {
    id: 10,
    name: 'EVOQUE Blonde Purple 2-Phase 400ml',
    nameEn: 'EVOQUE Blonde Purple 2-Phase 400ml',
    description: 'Leave-in 2 φάσεων για ξανθά και αποχρωματισμένα μαλλιά. Ξεμπλέκει, ενυδατώνει και διατηρεί ζωντανό και φρέσκο το χρώμα χωρίς ξέπλυμα. Ιδανικό για γυναίκες που κάνουν ανταύγειες ή balayage.',
    descriptionEn: 'Leave-in 2-phase for blonde and bleached hair. Detangles, hydrates and keeps colour vibrant without rinsing. Ideal for women with highlights or balayage.',
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
    description: 'Επαγγελματική πομάδα μαλλιών με ματ αποτέλεσμα και δυνατό κράτημα. Για σύγχρονα ανδρικά χτενίσματα — undercut, quiff, slick back — με φυσικό, μη λιπαρό φινίρισμα.',
    descriptionEn: 'Professional hair pomade with matte finish and strong hold. For modern men\'s hairstyles — undercut, quiff, slick back — with a natural, non-greasy finish.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 12,
    name: 'EVOQUE Pomade Shine No5 100ml',
    nameEn: 'EVOQUE Pomade Shine No5 100ml',
    description: 'Πομάδα μαλλιών με γυαλιστερό αποτέλεσμα και μέτριο-δυνατό κράτημα. Χαρίζει λάμψη, ορισμό και στυλ για classic και retro χτενίσματα. Ιδανική για ανδρικά μαλλιά που θέλουν λάμψη.',
    descriptionEn: 'Hair pomade with shine finish and medium-strong hold. Gives gloss, definition and style for classic and retro hairstyles. Ideal for men\'s hair that needs shine.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 13,
    name: 'EVOQUE Creamy Matte Strong Hold No3 100ml',
    nameEn: 'EVOQUE Creamy Matte Strong Hold No3 100ml',
    description: 'Κρεμώδης πομάδα μαλλιών με ματ φινίρισμα και πολύ δυνατό κράτημα όλη μέρα. Ιδανική για δύσκολα χτενίσματα και πυκνά ανδρικά μαλλιά που χρειάζονται έλεγχο.',
    descriptionEn: 'Creamy hair pomade with matte finish and very strong all-day hold. Ideal for challenging hairstyles and thick men\'s hair that needs control.',
    price: 8.00,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 14,
    name: 'EVOQUE Hair Butter 150ml',
    nameEn: 'EVOQUE Hair Butter 150ml',
    description: 'Βούτυρο μαλλιών με φυσικά θρεπτικά έλαια για βαθιά ενυδάτωση και μαλακό κράτημα. Ιδανικό για ξηρά, σγουρά και αφυδατωμένα γυναικεία μαλλιά που χρειάζονται θρέψη και φροντίδα.',
    descriptionEn: 'Hair butter with natural nourishing oils for deep hydration and soft hold. Ideal for dry, curly and dehydrated women\'s hair that needs nourishment and care.',
    price: 14.50,
    image: '',
    category: 'Styling',
    inStock: true
  },
  {
    id: 15,
    name: 'EVOQUE Forming Cream 150ml',
    nameEn: 'EVOQUE Forming Cream 150ml',
    description: 'Κρέμα φορμαρίσματος για φυσικό κράτημα, ορισμό και ενυδάτωση. Κατάλληλη για όλους τους τύπους μαλλιών — ιδανική για γυναίκες που θέλουν φυσικό αποτέλεσμα χωρίς βάρος.',
    descriptionEn: 'Forming cream for natural hold, definition and hydration. Suitable for all hair types — ideal for women who want a natural result without weight.',
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
    description: 'Ορός μαλλιών με γαλακτοπρωτεΐνες για εντυπωσιακή λάμψη και μεταξένιο αποτέλεσμα. Καταπολεμά το φριζάρισμα, ενυδατώνει βαθιά και προστατεύει από τη θερμότητα. Για γυναικεία μαλλιά που θέλουν λάμψη σαν κινηματογράφο.',
    descriptionEn: 'Hair serum with milk proteins for impressive shine and silky result. Fights frizz, deeply hydrates and protects from heat. For women\'s hair that wants cinema-worthy shine.',
    price: 24.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 17,
    name: 'EVOQUE Milk Therapy Creamy Mousse 200ml',
    nameEn: 'EVOQUE Milk Therapy Creamy Mousse 200ml',
    description: 'Κρεμώδης αφρός μαλλιών με γαλακτοπρωτεΐνες για κράτημα, ενυδάτωση και ορισμό μπούκλας. Ιδανικός για σγουρά και κυματιστά γυναικεία μαλλιά — ορίζει τη μπούκλα χωρίς να σκληραίνει.',
    descriptionEn: 'Creamy hair mousse with milk proteins for hold, hydration and curl definition. Ideal for curly and wavy women\'s hair — defines curls without hardening.',
    price: 14.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 18,
    name: 'EVOQUE Creamy Milk Μάσκα 500ml',
    nameEn: 'EVOQUE Creamy Milk Mask 500ml',
    description: 'Κρεμώδης μάσκα μαλλιών με γαλακτοπρωτεΐνες για βαθιά αναδόμηση και εντατική ενυδάτωση. Ιδανική για ξηρά, ταλαιπωρημένα και βαμμένα γυναικεία μαλλιά. Αποτέλεσμα απαλό σαν μετάξι.',
    descriptionEn: 'Creamy hair mask with milk proteins for deep restructuring and intensive hydration. Ideal for dry, damaged and coloured women\'s hair. Silky smooth result.',
    price: 39.00,
    image: '',
    category: 'Milk Therapy',
    inStock: true
  },
  {
    id: 19,
    name: 'EVOQUE Mini Creamy Milk Μάσκα 50ml',
    nameEn: 'EVOQUE Mini Creamy Milk Mask 50ml',
    description: 'Ταξιδιωτικό μέγεθος 50ml της αγαπημένης μάσκας Creamy Milk. Βαθιά αναδόμηση και ενυδάτωση για ταλαιπωρημένα μαλλιά σε πρακτικό μέγεθος για αποσκευές καμπίνας.',
    descriptionEn: 'Travel size 50ml of the beloved Creamy Milk Mask. Deep restructuring and hydration for damaged hair in a practical carry-on size.',
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
    description: 'Αφρός κλειδώματος χρώματος για βαμμένα μαλλιά. Προστατεύει τη βαφή από ξεθώριασμα, διατηρεί ζωντανά τα χρώματα και ενισχύει τη λάμψη. Ιδανικός για γυναίκες που βάφουν τα μαλλιά τους τακτικά.',
    descriptionEn: 'Color lock mousse for coloured hair. Protects dye from fading, keeps colours vibrant and enhances shine. Ideal for women who regularly colour their hair.',
    price: 16.00,
    image: '',
    category: 'Health Care',
    inStock: true
  },
  {
    id: 21,
    name: 'EVOQUE Healthy Care Color Lock 2850ml',
    nameEn: 'EVOQUE Healthy Care Color Lock 2850ml',
    description: 'Επαγγελματική μεγάλη συσκευασία 2850ml για κομμωτήρια και επαγγελματίες. Κλειδώνει το χρώμα βαφής, διατηρεί ζωντανές τις ανταύγειες και το balayage. Εξαιρετική τιμή για επαγγελματική χρήση.',
    descriptionEn: 'Professional 2850ml bulk size for salons and professionals. Locks in hair colour, keeps highlights and balayage vibrant. Excellent value for professional use.',
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
    description: 'Παιδικό τζελ μαλλιών με ήπια, ασφαλή σύνθεση χωρίς σκληρά χημικά. Κρατάει το παιδικό χτένισμα όλη μέρα, ξεπλένεται εύκολα. Κατάλληλο για αγόρια και κορίτσια — ιδανικό για σχολείο.',
    descriptionEn: 'Kids hair gel with mild, safe formula free from harsh chemicals. Holds the children\'s hairstyle all day, rinses out easily. Suitable for boys and girls — ideal for school.',
    price: 7.50,
    image: '',
    category: 'Παιδικά',
    inStock: true
  }

];

export default products;
