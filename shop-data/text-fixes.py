# -*- coding: utf-8 -*-
"""
Διορθώσεις σε κείμενα προϊόντων όπου τα στοιχεία της L'Oréal έχουν λάθος.
Εφαρμόζονται ΠΑΝΤΑ (και στα ελληνικά και στα αγγλικά), από το scripts/shop/apply_translations.py,
και επιβιώνουν κάθε νέο build_catalog.py. Κάθε διόρθωση γράφει από πού προέρχεται.
"""

FIX = {
    # Η λίστα συστατικών στο αρχείο της L'Oréal ήταν συστατικών σκόνης ξανοίγματος (persulfates),
    # όχι της πούδρας. Κείμενο από τη σελίδα του προϊόντος (L'Oréal Professionnel), όπως το έδωσε ο ιδιοκτήτης.
    # Λίστα συστατικών δεν μπαίνει μέχρι να βρεθεί η σωστή.
    "loreal-tecni-art-super-dust-poydra-gia-kratima": {
        "description": {
            "el": (
                "Το Tecni.ART Super Dust της L’Oréal Professionnel είναι μία πούδρα μαλλιών για όγκο και υφή με ματ τελείωμα.\n\n"
                "[ΑΠΟΤΕΛΕΣΜΑ] Πλούσιο σε μεταλλική πούδρα για έξτρα όγκο.\n\n"
                "[HAIRSTYLE] Ατημέλητο look, χτενίσματα προς τα πίσω."
            ),
            "en": (
                "Tecni.ART Super Dust by L’Oréal Professionnel is a hair powder for volume and texture with a matte finish.\n\n"
                "[RESULT] Rich in mineral powder for extra volume.\n\n"
                "[HAIRSTYLE] Undone looks, swept-back styles."
            ),
        },
        "howTo": {
            "el": (
                "Ανακινήστε πριν τη χρήση και μετά εφαρμόστε την πούδρα στις παλάμες των χεριών σας. Εφαρμόστε σε στεγνά μαλλιά "
                "σε μήκη και άκρες και δώστε όγκο στα μαλλιά. Για περισσότερο όγκο, εφαρμόστε κατευθείαν στη ρίζα, ανακινήστε τη "
                "συσκευασία σε απόσταση 1εκ από τη ρίζα. Πολύ χρήσιμο για κότσους με όγκο και εύκολα πιασίματα προς τα πίσω."
            ),
            "en": (
                "Shake before use, then tap the powder into your palms. Apply to dry hair through lengths and ends to build volume. "
                "For more volume, apply straight to the roots, shaking the pack 1 cm from the root. Very useful for voluminous buns "
                "and easy swept-back styles."
            ),
        },
        "safety": {
            "el": "Σε περίπτωση επαφής με τα μάτια, ξεπλύνετε.",
            "en": "In case of contact with eyes, rinse.",
        },
    },
}
