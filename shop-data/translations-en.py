# -*- coding: utf-8 -*-
"""
Αγγλικά κείμενα για προϊόντα όπου η L'Oréal δεν δίνει αγγλική εκδοχή (ή δίνει ελληνική στη θέση της).
Τα διαβάζει το scripts/shop/build_catalog.py (και το scripts/shop/apply_translations.py) και τα βάζει
στο πεδίο "en" μόνο όταν το "en" λείπει ή είναι στην πράξη ελληνικό. Οι λίστες συστατικών (INGREDIENTS)
και η διεύθυνση της L'Oréal μένουν αυτούσιες.
"""

CONTACT = "L'Oréal Professionnel, 14, rue Royale - 75008 Paris France, consumercaregreece@loreal.com"
EYES = "In case of contact with eyes, rinse immediately."
EYES_KIDS = EYES + "\nKeep out of reach of children."
NO_PRECAUTIONS = "No special precautions are required for use of this product under normal or reasonably foreseeable conditions of use."
AEROSOL = (
    "WARNING -- EXTREMELY FLAMMABLE AEROSOL.\n"
    "Pressurised container: may burst if heated. Keep away from heat, hot surfaces, sparks, open flames and other ignition sources. "
    "No smoking. Do not spray on an open flame or other ignition source. Do not pierce or burn, even after use. Protect from sunlight. "
    "Do not expose to temperatures exceeding 50°C. DO NOT LEAVE IN A CAR, IN THE SUN, ON THE BEACH OR ON A RADIATOR. "
    "DO NOT USE ANY DEFORMED CONTAINER.\n"
    "Keep out of reach of children. Avoid spraying towards the eyes or onto irritated skin, and avoid deliberate inhalation. "
    "Do not use for any purpose other than the one intended. Do not use in a confined space."
)
REFILL = (
    "Refill: twist off the cap. Pour the contents into an empty pack of the same product. Do not rinse the reusable pack and "
    "protect it from external factors. Note the date you refilled it and keep the reusable pack's number, printed on its back."
)

EN = {
    "loreal-absolut-repair-elaio-trepis-gia-oloys-toys": {
        "name": "Absolut Repair Nourishing Oil for All Hair Types",
        "description": (
            "Enriched with GOLD QUINOA + PROTEIN, the professional Absolut Repair Oil formula gives damaged hair intensive care, "
            "instant resurfacing, shine and a light touch, and preps it for blow-drying so it is easier to shape. "
            "The oil can also be used to perfect your styling: thanks to the pump that measures the right dose, hair stays shiny "
            "and silky to the touch, with no greasy feel."
        ),
    },
    "loreal-absolut-repair-molecular-bi-phase-oil-gia": {
        "name": "Absolut Repair Molecular Bi-Phase Oil for Damaged Hair",
        "safety": NO_PRECAUTIONS,
    },
    "loreal-absolut-repair-molecular-mini-duo-set-sampoyan-2": {
        "name": "Absolut Repair Molecular Mini Duo Set Shampoo & Leave-in Mask",
        "description": (
            "[Molecular Repair & Protection Set] Repair 2 years of damage in a single use* with the Absolut Repair Molecular Mini Duo Set. "
            "When hair is damaged, its molecular structure (peptides) is compromised, leaving it weak and lacking movement.\n\n"
            "[SCIENTIFIC BREAKTHROUGH - MOLECULAR REPAIR] For the first time, L’Oréal Advanced Research has broken peptides down so that "
            "their building blocks (amino acids & peptide bonds) can enter the hair fibre separately**. Once inside, they rebuild the hair's "
            "molecular structure***, bringing back its healthy look.\n\n"
            "[PROVEN RESULTS]\n\n"
            "Instant repair: repairs 2 years of damage in a single application*.\n"
            "Strength & elasticity: restores strength, elasticity and natural movement****.\n"
            "Protection & smoothness: hair is visibly smoother, shinier and protected from external aggressors.\n"
            "Heat protection: the leave-in mask protects against heat up to 230°C.\n"
            "[PROFESSIONAL FORMULA]\n\n"
            "Shampoo: sulfate-free formula with 2% peptide bonds + 5 amino acids. Cleanses, detangles and gives high care.\n"
            "Leave-in mask: light texture that absorbs instantly, restoring strength. Natural touch and instant transformation.\n"
            "Fragrance: a signature by leading perfumers, with notes of bergamot, vanilla and sandalwood.\n"
            "[RECOMMENDED FOR]: all types of damaged, coloured, highlighted or natural hair.\n\n"
            "*Lab test on the hair's macromolecular structure after shampoo + leave-in mask. **Amino acids & peptide bonds. "
            "***Lab test after 15 applications. ****Consumer test.\n\n"
            "Repairs 2 years of damage in one use*. Rebuilds the hair's molecular structure**. Restores strength, elasticity and movement***. "
            "Heat protection up to 230°C. Sulfate-free formula. *Lab test. **Lab test after 15 applications. ***Consumer test."
        ),
        "howTo": (
            "Shampoo: apply evenly to wet hair. Work into a rich lather and rinse thoroughly.\n"
            "Leave-in mask: apply to towel-dried hair. Spread evenly over lengths and ends. Do not rinse. Blow-dry and style."
        ),
        "safety": EYES_KIDS,
    },
    "loreal-absolut-repair-molecular-mini-duo-set-sampoyan": {
        "name": "Absolut Repair Molecular Mini Duo Set Shampoo & Oil",
        "description": (
            "[SCIENTIFIC BREAKTHROUGH - MOLECULAR REPAIR] When hair is damaged, its molecular structure, made of peptides, is compromised. "
            "Hair becomes weak, over-elastic and lacks movement. But most peptides are too large to get inside the hair fibre, which makes the "
            "damage almost irreversible. Scientific breakthrough - Absolut Repair Molecular. Repairs 2 years of damage in one use*.\n\n"
            "For the first time, L'Oréal Advanced Research has broken peptides down so that their building blocks, amino acids & peptide bonds, "
            "can enter the hair fibre separately**. Once inside, they rebuild the hair's molecular structure***.\n\n"
            "[PROVEN RESULTS]\n\n"
            "Damage repair: repairs 2 years of damage in a single use*.\n"
            "Strength & elasticity: hair is +97% stronger, with better elasticity and natural movement.\n"
            "Shine & softness: 100 hours of shine and up to +86% more softness.\n"
            "Frizz control: frizz protection for 3 days.\n\n"
            "[PROFESSIONAL FORMULA]\n\n"
            "Shampoo: sulfate-free formula with 2% peptide bonds + 5 amino acids. Cleanses, detangles and nourishes without weighing hair down.\n"
            "Bi-phase oil: patented technology with a light texture that absorbs instantly. Phase 1 (water): peptide bonds to rebuild. "
            "Phase 2 (oil): concentrated care for shine and protection.\n"
            "Fragrance: a long-lasting premium signature by leading perfumers.\n\n"
            "[RECOMMENDED FOR]: all types of damaged hair (coloured, highlighted or natural).\n\n"
            "Repairs 2 years of damage in one use*. +97% more strength** and 100 hours of shine. Rebuilds the hair's molecular structure***. "
            "Sulfate-free formula. *Lab test. **Lab test on the oil. ***Lab test after 15 applications.\n\n"
            "*Lab test after shampoo, serum & leave-in mask. **Amino acids & peptide bonds."
        ),
        "howTo": (
            "Shampoo: apply evenly to wet hair. Work into a rich lather and rinse thoroughly.\n"
            "Bi-phase oil: shake well before use. Apply to towel-dried or dry hair. Spread evenly over lengths and ends. Do not rinse. Style."
        ),
        "safety": EYES_KIDS + "\n\n" + CONTACT,
    },
    "loreal-aminexil-advanced-anti-hairloss-programme-against-hair": {"safety": EYES},
    "loreal-curl-expression-caring-water-curls-reviver-for": {"safety": NO_PRECAUTIONS},
    "loreal-infinium-pure-hairspray": {
        "howTo": "Use on dry hair and spray from a distance of 35 cm.\n\n" + EYES,
        "safety": AEROSOL,
    },
    "loreal-keratin-alpha-sleek-professional-hair-mask": {"safety": "In case of contact with eyes, rinse immediately and thoroughly."},
    "loreal-keratin-alpha-sleek-professional-mirror-sleek-serum": {"safety": EYES_KIDS},
    "loreal-keratin-alpha-sleek-professional-sulfate-free-shampoo": {"safety": EYES},
    "loreal-keratin-alpha-sleek-smooth-transformer-progressive-smoothing": {"safety": EYES},
    "loreal-metal-detox-leave-in-krema-apomakrynsis-kai": {
        "name": "Metal Detox Leave-in Cream to Remove and Protect from Metals",
        "description": (
            "[SCIENTIFIC BREAKTHROUGH] With every wash, metals such as copper get inside the hair fibre, causing breakage and colour fading.\n\n"
            "[INNOVATION] Enriched with 1% glycoamine, this high-protection cream removes metals* from the hair and protects it from new "
            "deposits, putting an end to breakage and colour fading.\n\n"
            "[HIGH PROTECTION] With UV filters, it protects hair from damage and oxidation caused by UV light. It also protects against "
            "brushing and heat up to 230°C/450°F**.\n\n"
            "[ANTI-FRIZZ] Locks in moisture and controls frizz for up to 72 hours**, even in high humidity. 3 times more hold on shape**. "
            "Richly hydrated and strengthened, hair is instantly more manageable, easier to style and healthier-looking. Hair stays softer and smoother.\n\n"
            "[COLOUR CARE] Hair is shinier and colour lasts longer. 97% of colour radiance is kept after 8 weeks**\n\n"
            "[PROFESSIONAL FORMULA] Its creamy texture absorbs instantly and coats the hair fibre without weighing it down.\n\n"
            "[RECOMMENDED FOR ALL HAIR TYPES] For all hair textures: coloured, damaged, lightened and natural hair.\n\n"
            "[ASK FOR THE METAL DETOX PROTOCOL AT THE SALON]: on your next salon visit, ask for the Metal Detox protocol to put an end to "
            "breakage and colour fading: 100% professional, long-lasting colour*** and -97% less breakage****. Metal Detox was developed "
            "together with expert colourists for colour, balayage and natural results. @sebastiancolorist, @washingtonnunnes, @lucasdioslo, @charlotte_catherin\n\n"
            "*Instrumental test after 10 applications.\n\n"
            "**Test with Metal Detox high-protection cream\n\n"
            "*** Instrumental test on Metal Detox shampoo + mask\n\n"
            "**** Instrumental test on Metal Detox concentrated oil\n\n"
            + CONTACT + "\n\n"
            "Apply daily to dry or towel-dried hair, spreading evenly from lengths to ends. Do not rinse. Blow-dry or let dry naturally.\n\n"
            + NO_PRECAUTIONS + "\n\n"
            "1261039 F - INGREDIENTS: AQUA / WATER / EAU • BUTYLENE GLYCOL • AMINOPROPYL DIMETHICONE • ISODODECANE • ISONONYL ISONONANOATE • GLYCINE • "
            "PEG-240/HDI COPOLYMER BIS-DECYLTETRADECETH-20 ETHER • CAPRYLYL GLYCOL • UNDECANE • SCLEROTIUM GUM • TRIDECANE • TOCOPHEROL • "
            "ETHYLHEXYL SALICYLATE • CARVONE • LIMONENE • CITRUS AURANTIUM PEEL OIL • SODIUM CITRATE • CITRIC ACID • TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • "
            "LINALYL ACETATE • HEXYL CINNAMAL • LINALOOL • PINENE • CITRAL • GERANIOL • GERANYL ACETATE • LEMONGRASS OIL • BETA-CARYOPHYLLENE • "
            "COUMARIN • POGOSTEMON CABLIN OIL • POTASSIUM LAURATE • POLYQUATERNIUM-7 • ALPHA-TERPINENE • SODIUM BENZOATE • PARFUM / FRAGRANCE (F.I.L. N70019660/2)."
        ),
    },
    "loreal-metal-detox-maska-gia-apolyti-epanortosi-mallion": {
        "name": "Metal Detox Mask for Ultimate Hair Repair",
        "description": (
            "[SCIENTIFIC BREAKTHROUGH] A build-up of metals inside the hair fibre can cause breakage and spoil the colour result.\n\n"
            "Metal Detox Mask. The hairdressers' choice for ultimate hair repair. 97% less breakage.* 100 hours of intense hydration.* "
            "Enriched with glycoamine.\n\n"
            "Instrumental test after use of Metal Detox Mask.\n\n"
            "The Metal Detox protection & detox mask coats the hair and protects it from new deposits while hydrating deeply. It contains "
            "glycoamine, an ingredient small enough to get inside the hair, trap metals and neutralise their effect.\n\n"
            "On your next salon visit, ask your hairdresser for the Metal Detox salon service with glycoamine and put an end to breakage and "
            "colour fading. A professional guarantee for colour, balayage and lightening. Once hair has been cleansed of heavy metal deposits "
            "with Metal Detox Shampoo, it is important to protect it from new deposits by applying the mask.\n\n"
            "With an addictive fragrance and a unique signature: an unforgettable citrus blend with a musky wood character.\n\n"
            "RESULTS\n"
            "High levels of care: hair is nourished, soft and easy to comb.\n\n"
            "• Protection against metal deposits\n"
            "• 97% less breakage.\n"
            "• 100 hours of intense hydration.*\n"
            "• Softness and nourishment\n\n"
            "*Instrumental test after use of Metal Detox Mask.\n\n"
            + CONTACT + "\n\n"
            "Apply to towel-dried hair after washing with the metal-removing shampoo. Leave on for 3-5 minutes. Rinse well with plenty of water.\n\n"
            + EYES + "\n\n"
            "1248606 B - INGREDIENTS: AQUA / WATER / EAU • CETEARYL ALCOHOL • AMODIMETHICONE • BEHENTRIMONIUM CHLORIDE • CETYL ESTERS • PARFUM / FRAGRANCE • "
            "ISOPROPYL ALCOHOL • TRIDECETH-6 • PHENOXYETHANOL • CARVONE • LIMONENE • CITRUS AURANTIUM PEEL OIL • CETRIMONIUM CHLORIDE • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • LINALYL ACETATE • HEXYL CINNAMAL • LINALOOL • PINENE • CHLORHEXIDINE DIHYDROCHLORIDE • CITRAL • "
            "GERANIOL • GLYCINE • TOCOPHEROL • POLYQUATERNIUM-7 • SODIUM BENZOATE (F.I.L. N263113/2)."
        ),
    },
    "loreal-metal-detox-mini-duo-kit-gia-prostasia": {
        "name": "Metal Detox Mini Duo Kit for Protection from Metals",
        "description": (
            "[Anti-Breakage Hair Kit] Discover Metal Detox, the exclusive hair-care protocol enriched with glycoamine, a molecule small enough "
            "to get inside the hair fibre and weaken the metals in your hair. 95% less breakage*.\n\n"
            "Metal Detox 2-step professional routine:\n"
            "1. Anti-metal cleansing shampoo\n"
            "2. Protective mask\n\n"
            "[SCIENTIFIC BREAKTHROUGH] When water corrodes metal pipes, it can become loaded with metals that get inside the hair fibre, leading "
            "to more breakage and faded colour. This can damage the inside of the hair and create unwanted tones that spoil the colour result.\n\n"
            "[PROVEN RESULTS] 95% less breakage*. Hair is smoother and stronger, richly nourished. Colour is 2x shinier* and lasts longer.\n\n"
            "[PROFESSIONAL FORMULA] Anti-metal cleansing shampoo: a rich, sulfate-free shampoo that turns into a dense lather. Rinses out easily. "
            "Protective mask: fast-absorbing creamy mask with high cosmetic care for all hair types. Rinses out easily. Sulfate-free.\n\n"
            "[RECOMMENDED FOR ALL TYPES OF DAMAGED HAIR] For all coloured, damaged and natural hair.\n"
            "*Lab test after Shampoo + Mask."
        ),
        "howTo": (
            "1. Apply Metal Detox Shampoo evenly to wet hair. Massage into a rich lather. Rinse well.\n"
            "2. Apply Metal Detox Mask to wet hair. Work it through your hair for 1 minute until a light foam forms. Rinse well."
        ),
        "safety": EYES,
    },
    "loreal-scalp-advanced-anti-oiliness-dermo-purifier-shampoo": {"safety": EYES_KIDS},
    "loreal-steampod-professional-smoothing-treatment": {"safety": EYES},
    "loreal-tecni-art-all-in-1-performer-styling": {"safety": "Do not rinse. In case of contact with eyes, rinse immediately and thoroughly."},
    "loreal-tecni-art-fix-anti-frizz-spray": {
        "description": (
            "Tecni.ART Fix Anti-Frizz Spray by L’Oréal Professionnel gives strong hold that lasts up to 24 hours. Take control and shape your favourite looks!\n"
            "[RESULT] Shiny hair with strong hold and frizz control.\n\n"
            "Spray from 35 cm onto dry or slightly damp hair. Create the style you want. For more volume, spray directly at the roots.\n"
            "Tip: to tame flyaways, spray onto your hands and smooth over the hair.\n\n"
            + AEROSOL + "\n\n"
            "1247661 - INGREDIENTS: ALCOHOL DENAT. • DIMETHYL ETHER • ACRYLATES/t-BUTYLACRYLAMIDE COPOLYMER • AQUA / WATER • AMINOMETHYL PROPANOL • "
            "BENZYL ALCOHOL • BENZYL SALICYLATE • CARVONE • CITRAL • CITRUS AURANTIUM PEEL OIL • CITRUS LIMON PEEL OIL • HEXAMETHYLINDANOPYRAN • "
            "HEXYL CINNAMAL • HYDROXYCITRONELLAL • LAVANDULA OIL/EXTRACT • LIMONENE • LINALOOL • LINALYL ACETATE • PINENE • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • PARFUM / FRAGRANCE (F.I.L. Z70041329/10)."
        ),
    },
    "loreal-tecni-art-fix-design-spray": {
        "description": (
            "Professional Tecni.ART spray that gives hair strong hold with an anti-frizz action. A protective spray against humidity and frizz, "
            "with unique, long-lasting anti-frizz protection, even in extreme weather. Strong, lasting hold with no residue.\n\n"
            + CONTACT + "\n\n"
            "Spray from 15 cm onto damp or dry hair, or from further away for a drier finish.\n\n"
            + EYES + "\n\n"
            "1059836 B - INGREDIENTS: ALCOHOL DENAT. • VA/CROTONATES/VINYL NEODECANOATE COPOLYMER • AMINOMETHYL PROPANOL • PEG/PPG-4/12 DIMETHICONE • "
            "LINALOOL • HEXYL CINNAMAL • LINALYL ACETATE • TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • CARVONE • CITRUS AURANTIUM PEEL OIL • LIMONENE • "
            "HEXAMETHYLINDANOPYRAN • GERANIOL • CITRONELLOL • BENZYL ALCOHOL • COUMARIN • PENTAERYTHRITYL TETRA-DI-T-BUTYL HYDROXYHYDROCINNAMATE • "
            "PARFUM / FRAGRANCE (F.I.L. Z230959/2)."
        ),
    },
    "loreal-tecni-art-fix-max-zele-diamorfosis": {
        "name": "Tecni.ART Fix Max Shaping Gel",
        "description": (
            "Tecni.ART Fix Max is a professional shaping gel for extra hold, with a pleasant, refreshing fragrance. It won't make your hair "
            "sticky or leave residue on the scalp, and leaves hair soft and shiny.\n\n"
            + CONTACT + "\n\n"
            "Apply with your hands for all-over hold, or use your fingertips to define individual strands.\n\n"
            + EYES + "\n\n"
            "1001124 F8 - INGREDIENTS: AQUA / WATER / EAU • ALCOHOL DENAT. • AMP-ACRYLATES/ALLYL METHACRYLATE COPOLYMER • SORBITOL • AMINOMETHYL PROPANOL • "
            "CARBOMER • PEG-40 HYDROGENATED CASTOR OIL • HYDROXYPROPYL GUAR • PHENOXYETHANOL • TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • BENZYL SALICYLATE • "
            "ALPHA-ISOMETHYL IONONE • BENZYL ALCOHOL • HYDROXYCITRONELLAL • LINALOOL • GERANIOL • CARVONE • CITRAL • LIMONENE • CITRONELLOL • COUMARIN • "
            "PINENE • BENZALDEHYDE • CANANGA ODORATA OIL/EXTRACT • ISOEUGENOL • POGOSTEMON CABLIN OIL • VANILLIN • PARFUM / FRAGRANCE (F.I.L. N70090380/1)."
        ),
    },
    "loreal-tecni-art-flex-blowdry-professional-pre-styling": {"safety": EYES},
    "loreal-tecni-art-flex-curl-bounce-professional-styling": {"safety": "In case of contact with eyes, rinse with plenty of water."},
    "loreal-tecni-art-flex-depolish-pasta-diamorfosis": {
        "name": "Tecni.ART Flex Depolish Shaping Paste",
        "description": (
            "Tecni.ART Depolish is a professional, pliable shaping paste for a deconstructed, rough, undone look. A TECNI.ART must-have that "
            "shapes and mattifies hair for a 'rough' finish you can restyle endlessly.\n\n"
            + CONTACT + "\n\n"
            "Apply to dry hair with your hands for a matte finish. Work it with your fingers for a flexible finish and to shape strands.\n\n"
            + EYES + "\n\n"
            "1118759 G - INGREDIENTS: AQUA / WATER / EAU • PEG-40 HYDROGENATED CASTOR OIL • DIMETHICONE • PETROLATUM • STEARYL ALCOHOL • C20-40 ALKYL STEARATE • "
            "PPG-5-CETETH-20 • TRIBEHENIN • VP/VA COPOLYMER • BUTYLENE GLYCOL • PEG-150 PENTAERYTHRITYL TETRASTEARATE • PHENOXYETHANOL • CELLULOSE GUM • "
            "SORBIC ACID • SODIUM BENZOATE • LINALOOL • LIMONENE • BENZYL SALICYLATE • BENZYL ALCOHOL • HEXYL CINNAMAL • CITRAL • ALPHA-ISOMETHYL IONONE • "
            "HYDROXYCITRONELLAL • GERANIOL • PARFUM / FRAGRANCE (F.I.L. C251078/1)."
        ),
    },
    "loreal-tecni-art-flex-pli-spray": {
        "description": (
            "Tecni.ART Pli Shaper is a professional heat-activated spray. It gives hair body and control while keeping a soft texture and "
            "natural feel. Lifts roots instantly and creates light curls or wavy styles.\n\n"
            + CONTACT + "\n\n"
            "Apply a generous amount to towel-dried hair, lifting the roots as you comb, or use rollers for even more volume. "
            "For more creative looks, use with heated tools.\n\n"
            + EYES + "\n\n"
            "1181131 A - INGREDIENTS: AQUA / WATER • ALCOHOL DENAT. • VA/CROTONATES COPOLYMER • ISOPROPYL ALCOHOL • AMINOMETHYL PROPANOL • VP/VA COPOLYMER • "
            "CETRIMONIUM CHLORIDE • PEG-40 HYDROGENATED CASTOR OIL • HEXAMETHYLINDANOPYRAN • LINALOOL • BENZYL SALICYLATE • BENZYL ALCOHOL • AMYL CINNAMAL • "
            "HEXYL CINNAMAL • HYDROXYCITRONELLAL • CITRONELLOL • AMYL SALICYLATE • ALPHA-ISOMETHYL IONONE • CARVONE • GERANIOL • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • LIMONENE • GERANYL ACETATE • BENZALDEHYDE • EUGENOL • ANETHOLE • VANILLIN • ISOEUGENOL • "
            "PARFUM / FRAGRANCE (F.I.L. Z208636/2)."
        ),
    },
    "loreal-tecni-art-flex-waves-professionnel-texturizing-salt": {"safety": EYES},
    "loreal-tecni-art-liss-control-krema-gia-leiansi": {
        "name": "Tecni.ART Liss Control Smoothing & Control Cream",
        "description": (
            "Professional Tecni.ART cream for smoothing and control, ideal for fine hair. Effectively smooths and controls frizzy, curly hair. "
            "Makes styling easier. Protects from humidity for 24 hours. Gives perfect shine without weighing hair down. Provides UV protection. "
            "Hold level: Force 2.\n\n"
            + CONTACT + "\n\n"
            "Take a small amount on your fingertips and spread evenly over the lengths. No need to rinse.\n\n"
            + EYES
        ),
    },
    "loreal-tecni-art-morning-after-dust-xiro-sampoyan": {
        "name": "Tecni.ART Morning After Dust Dry Shampoo",
        "description": (
            "L'Oréal Professionnel Tecni.ART Morning After Dust is an invisible* dry shampoo that absorbs oil and leaves a wonderfully fresh "
            "fragrance for 24 hours**. Alcohol-free. * No visible white residue after brushing. ** Application experience test.\n\n"
            + CONTACT + "\n\n"
            + REFILL + "\n\n"
            + AEROSOL + "\n\n"
            "1247589 I - INGREDIENTS: ISOBUTANE • ORYZA SATIVA STARCH / RICE STARCH • CALCIUM CARBONATE • ISOPROPYL MYRISTATE • DISTEARDIMONIUM HECTORITE • "
            "LINALOOL • LINALYL ACETATE • BENZYL SALICYLATE • CARVONE • LIMONENE • BENZYL ALCOHOL • ACETYL CEDRENE • CETRIMONIUM CHLORIDE • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • POGOSTEMON CABLIN OIL • ALPHA-ISOMETHYL IONONE • PINENE • BENZALDEHYDE • CITRAL • GERANIOL • "
            "CITRUS LIMON PEEL OIL • PARFUM / FRAGRANCE (F.I.L. Z70052031/3)."
        ),
    },
    "loreal-tecni-art-super-dust-poydra-gia-kratima": {"name": "Tecni.ART Super Dust Hold Powder"},
    "loreal-tecni-art-volume-extra-full-afros": {
        "name": "Tecni.ART Volume Extra Full Mousse",
        "description": (
            "Professional TECNI.ART Full Volume Extra mousse gives your hair extra volume and very strong hold, without weighing it down.\n\n"
            + CONTACT + "\n\n"
            "Apply to washed, towel-dried hair. Shake the can well, hold it upside down and dispense a hazelnut-sized amount of mousse into "
            "your palms. Work through your hair with a comb or your fingers to build volume.\n\n"
            + AEROSOL + "\n\n"
            "1001128 G - INGREDIENTS: AQUA / WATER / EAU • PROPYLENE GLYCOL • ISOBUTANE • ACRYLATES COPOLYMER • BUTANE • AMINOMETHYL PROPANOL • PROPANE • "
            "VP/ACRYLATES/LAURYL METHACRYLATE COPOLYMER • TRIACETIN • PHENOXYETHANOL • ALCOHOL DENAT. • PEG-40 HYDROGENATED CASTOR OIL • "
            "VINYL CAPROLACTAM/VP/DIMETHYLAMINOETHYL METHACRYLATE COPOLYMER • AMODIMETHICONE • CAPRYLYL GLYCOL • POLYSORBATE 20 • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • POLYSORBATE 80 • TRIDECETH-6 • BENZYL SALICYLATE • SODIUM LAURYL SULFATE • ALPHA-ISOMETHYL IONONE • "
            "BENZYL ALCOHOL • 2-OLEAMIDO-1,3-OCTADECANEDIOL • HYDROXYCITRONELLAL • CETRIMONIUM CHLORIDE • LINALOOL • GERANIOL • CITRAL • CARVONE • LIMONENE • "
            "CITRONELLOL • COUMARIN • PINENE • BENZALDEHYDE • CANANGA ODORATA OIL/EXTRACT • ISOEUGENOL • POGOSTEMON CABLIN OIL • VANILLIN • "
            "PARFUM / FRAGRANCE (F.I.L. N70082579/1)."
        ),
    },
    "loreal-tecni-art-volume-panache-spray-me-poydra": {
        "name": "Tecni.ART Volume Panache Powder Spray",
        "description": (
            "Tecni.ART Volume Panache Powder Spray by L’Oréal Professionnel is the ultimate product to add volume, hold and texture to any style. "
            "[RESULT] Big volume with a dry texture for a matte finish.\n\n"
            "Spray at the roots and comb through for extra volume. Spray along the full length for a stronger result.\n\n"
            "1247660 I - INGREDIENTS: BUTANE • ALCOHOL DENAT. • CALCIUM CARBONATE • POLYVINYLCAPROLACTAM • DISTEARDIMONIUM HECTORITE • DIMETHICONE • "
            "DIMETHICONOL • AQUA / WATER (F.I.L. Z70043213/1)."
        ),
    },
    "loreal-tecni-art-volume-rootlift-afrodes-spray": {
        "name": "Tecni.ART Volume Rootlift Foam Spray",
        "description": (
            "Tecni.ART Volume Lift is a professional spray mousse that gives root volume and natural control, for a modern, voluminous hairstyle. "
            "Lengths and ends stay pliable and light.\n\n"
            + CONTACT + "\n\n"
            "Maximise volume by applying to washed, towel-dried hair. Shake the can well and spray at the root of each section from a few "
            "centimetres away to give your hair extra volume. Blow-dry or shape with your fingers.\n\n"
            + EYES + "\n\n"
            "401001 J - INGREDIENTS: AQUA / WATER • DIMETHYL ETHER • ALCOHOL DENAT. • ISOBUTANE • POLYQUATERNIUM-11 • BUTYL ESTER OF PVM/MA COPOLYMER • "
            "TRIETHANOLAMINE • AMODIMETHICONE • POLYQUATERNIUM-4 • POLYSORBATE 20 • HYDROXYPROPYL GUAR • CETRIMONIUM CHLORIDE • TRIDECETH-15 • TRIDECETH-3 • "
            "LINALOOL • BENZYL SALICYLATE • BENZYL BENZOATE • BENZYL ALCOHOL • PHENOXYETHANOL • CITRONELLOL • LIMONENE • ACETIC ACID • "
            "PARFUM / FRAGRANCE (F.I.L. C193389/1)."
        ),
    },
    "loreal-tecni-art-web-krema-diamorfosis": {
        "name": "Tecni.ART Web Shaping Cream",
        "description": (
            "Tecni.ART Web is a professional shaping paste to sculpt, shape and refine your style with a natural, shiny finish.\n\n"
            + CONTACT + "\n\n"
            "Apply to dry hair. Rub a hazelnut-sized amount between your hands, pull your hands slightly apart to stretch the fibres between "
            "them, then run them through your hair for a textured result.\n\n"
            + EYES + "\n\n"
            "454067 D3 - INGREDIENTS: AQUA / WATER / EAU • GLYCERIN • BUTYLENE GLYCOL • CETEARYL ALCOHOL • GLYCERYL STEARATE • PEG-100 STEARATE • PVP • "
            "DIMETHICONE • PHENOXYETHANOL • PEG-150 PENTAERYTHRITYL TETRASTEARATE • CHLORPHENESIN • HYDROXYPROPYL GUAR • SODIUM BENZOATE • PEG-90M • "
            "TETRAMETHYL ACETYLOCTAHYDRONAPHTHALENES • CHLORHEXIDINE DIHYDROCHLORIDE • BENZYL SALICYLATE • ALPHA-ISOMETHYL IONONE • BENZYL ALCOHOL • "
            "HYDROXYCITRONELLAL • LINALOOL • GERANIOL • SILICA • CARVONE • CITRAL • LIMONENE • CITRONELLOL • COUMARIN • PINENE • BENZALDEHYDE • "
            "CANANGA ODORATA OIL/EXTRACT • ISOEUGENOL • POGOSTEMON CABLIN OIL • VANILLIN • BHT • PARFUM / FRAGRANCE (F.I.L. N70090745/2)."
        ),
    },
    "loreal-vitamino-color-spectrum-deep-conditioner-for-all": {
        "safety": (
            "After Vitamino Color Spectrum Shampoo, apply the conditioner to wet hair. Divide your hair into 4 sections and apply evenly from "
            "lengths to ends. Massage for 1 to 2 minutes. Rinse well. Follow with Vitamino Color Spectrum Glass Shine Leave-in Serum."
        ),
    },
    "loreal-vitamino-color-spectrum-glass-shine-serum-for": {"safety": "In case of contact with eyes, rinse carefully with water."},
    "loreal-vitamino-color-spectrum-mask-for-all-colored": {
        "safety": (
            "After shampooing, divide wet hair into two sections. Spread evenly over each section. Work the product through from lengths to ends "
            "and detangle with your fingers. Leave on for 3 to 5 minutes. Rinse well. Follow with Vitamino Color Spectrum Glass Shine Leave-in Serum."
        ),
    },
    "loreal-vitamino-color-spectrum-professional-yellow-tones-neutralizing": {"safety": EYES_KIDS},
    "loreal-vitamino-color-spectrum-shampoo-refill-for-all": {
        "safety": (
            "To use: apply evenly to wet hair. Massage into a rich lather. Rinse well. Follow with Vitamino Color Spectrum Conditioner.\n\n" + REFILL
        ),
    },
}

# Ονόματα που η L'Oréal δίνει μόνο στα ελληνικά (τα αγγλικά ονόματα της σειράς μένουν όπως είναι)
NAMES = {
    "loreal-vitamino-color-sampoyan": "Vitamino Color Shampoo",
    "loreal-scalp-advanced-anti-discomfort-sampoyan-gia-to": "Scalp Advanced Anti-Discomfort Shampoo for Sensitive Scalp",
    "loreal-scalp-advanced-anti-dandruff-sampoyan-kata-tis": "Scalp Advanced Anti-Dandruff Shampoo",
    "loreal-pro-longer-leave-in-krema-kata-tis": "Pro Longer Leave-in Cream Against Split Ends for Longer Hair",
    "loreal-silver-conditioner-gia-leyka-i-asimi-mallia": "Silver Conditioner for White or Grey Hair",
    "loreal-pro-longer-maska-kata-tis-palidas-gia": "Pro Longer Mask Against Split Ends for Longer Hair",
    "loreal-vitamino-color-maska-gia-bammena-mallia": "Vitamino Color Mask for Coloured Hair",
    "loreal-absolut-repair-molecular-maska-moriakis-epanortosis-gia": "Absolut Repair Molecular Mask for Damaged Hair",
    "loreal-scalp-advanced-a-discomfort-peripoiisi-gia-to": "Scalp Advanced Anti-Discomfort Treatment for Sensitive Scalp",
    "loreal-scalp-advanced-anti-oily-argilos-kata-tis": "Scalp Advanced Anti-Oiliness Clay",
    "loreal-silver-sampoyan-gia-leyka-i-asimi-mallia": "Silver Shampoo for White or Grey Hair",
    "loreal-vitamino-color-conditioner-gia-bammena-mallia": "Vitamino Color Conditioner for Coloured Hair",
    "loreal-aminexil-advanced-full-strong-oros-kata-tis": "Aminexil Advanced Full, Strong Anti-Hair-Loss Serum",
    "loreal-pro-longer-conditioner-kata-tis-palidas-gia": "Pro Longer Conditioner Against Split Ends for Longer Hair",
    "loreal-serioxyl-advanced-density-sampoyan-gia-pyknosi": "Serioxyl Advanced Density Shampoo",
    "loreal-vitamino-color-sprei-pollaplon-xriseon-gia-bammena": "Vitamino Color 10-in-1 Multi-Use Spray for Coloured Hair",
    "loreal-absolut-repair-sampoyan": "Absolut Repair Shampoo",
    "loreal-metal-detox-sampoyan": "Metal Detox Shampoo",
    "loreal-metal-detox-elaio-apomakrynsis-kai-prostasias-apo": "Metal Detox Oil to Remove and Protect from Metals",
    "loreal-absolut-repair-molecular-sampoyan-moriakis-epanortosis-gia": "Absolut Repair Molecular Shampoo for Damaged Hair",
    "loreal-absolut-repair-molecular-mini-duo-kit-moriakis": "Absolut Repair Molecular Mini Duo Kit for Damaged Hair",
    "loreal-absolut-repair-molecular-serum-moriakis-epanortosis-poy": "Absolut Repair Molecular Rinse-off Serum for Damaged Hair",
    "loreal-serioxyl-advanced-density-oros-gia-pyknosi": "Serioxyl Advanced Density Serum",
    "loreal-metal-detox-pre-shampoo-peripoiisi-apomakrynsis-kai": "Metal Detox Pre-Shampoo Treatment to Remove and Protect from Metals",
    "loreal-pro-longer-sampoyan-kata-tis-palidas-gia": "Pro Longer Shampoo Against Split Ends for Longer Hair",
}
for _pid, _name in NAMES.items():
    EN.setdefault(_pid, {}).setdefault("name", _name)
