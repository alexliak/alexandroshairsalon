// Single source of the salon price list (same as Treatwell). Prices in euro, online.
// Change a price here and it updates the Services page.
const menu = [
  {
    "key": "haircuts",
    "title": {
      "el": "Κουρέματα",
      "en": "Haircuts"
    },
    "services": [
      {
        "name": {
          "el": "Γυναικείο κούρεμα",
          "en": "Women’s haircut"
        },
        "desc": {
          "el": "Pixie, mullet, butterfly, curtain bangs, φιλάρισμα ή κλασικό.",
          "en": "Pixie, mullet, butterfly, curtain bangs, texturising or classic."
        },
        "options": [
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "30′",
              "en": "30′"
            },
            "price": 28
          },
          {
            "el": "κάτω από τους ώμους ή πυκνά έως τους ώμους",
            "en": "below shoulders or thick",
            "time": {
              "el": "35′",
              "en": "35′"
            },
            "price": 31
          },
          {
            "el": "μακριά & πυκνά ή extensions",
            "en": "long & thick or extensions",
            "time": {
              "el": "45′",
              "en": "45′"
            },
            "price": 38
          }
        ]
      },
      {
        "name": {
          "el": "Ανδρικό κούρεμα",
          "en": "Men’s haircut"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "30′",
              "en": "30′"
            },
            "price": 24
          }
        ]
      },
      {
        "name": {
          "el": "Παιδικό κούρεμα",
          "en": "Kids’ haircut"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "30′",
              "en": "30′"
            },
            "price": 20
          }
        ]
      }
    ]
  },
  {
    "key": "styling",
    "title": {
      "el": "Χτένισμα",
      "en": "Blowout & Styling"
    },
    "services": [
      {
        "name": {
          "el": "Λούσιμο & γρήγορο φορμάρισμα",
          "en": "Wash & quick style"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "20′",
              "en": "20′"
            },
            "price": 20
          }
        ]
      },
      {
        "name": {
          "el": "Blowout · χτένισμα με πιστολάκι ή πρέσα",
          "en": "Blowout"
        },
        "options": [
          {
            "el": "κοντά",
            "en": "short",
            "time": {
              "el": "25′",
              "en": "25′"
            },
            "price": 24
          },
          {
            "el": "μεσαία ή μακριά, ή πυκνά κοντά",
            "en": "medium or long, or thick short",
            "time": {
              "el": "30′",
              "en": "30′"
            },
            "price": 28
          },
          {
            "el": "μακριά & πυκνά ή extensions",
            "en": "long & thick or extensions",
            "time": {
              "el": "40′",
              "en": "40′"
            },
            "price": 35
          }
        ]
      },
      {
        "name": {
          "el": "+ Πρέσα SteamPod",
          "en": "+ SteamPod flat iron"
        },
        "desc": {
          "el": "Προσθήκη στο Blowout.",
          "en": "Add-on to a blowout."
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "10′",
              "en": "10′"
            },
            "price": 9
          }
        ]
      },
      {
        "name": {
          "el": "Βραδινό χτένισμα & μπούκλες",
          "en": "Event hair & waves"
        },
        "options": [
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "45′",
              "en": "45′"
            },
            "price": 38
          },
          {
            "el": "κάτω από τους ώμους",
            "en": "below shoulders",
            "time": {
              "el": "1 ώρα",
              "en": "1 h"
            },
            "price": 49
          }
        ]
      },
      {
        "name": {
          "el": "Νυφικό δοκιμαστικό",
          "en": "Bridal trial"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "1 ώρα 15′",
              "en": "1 h 15′"
            },
            "price": 59
          }
        ]
      }
    ]
  },
  {
    "key": "color",
    "title": {
      "el": "Χρώμα & Gloss",
      "en": "Colour & Gloss"
    },
    "services": [
      {
        "name": {
          "el": "Βαφή ρίζας – κάλυψη λευκών",
          "en": "Root colour & grey coverage"
        },
        "desc": {
          "el": "Δωρεάν τεστ ευαισθησίας πριν από την πρώτη βαφή.",
          "en": "Free sensitivity test before your first colour."
        },
        "options": [
          {
            "el": "έως 6 εβδομάδες · Farcom",
            "en": "up to 6 weeks · Farcom",
            "time": {
              "el": "40′",
              "en": "40′"
            },
            "price": 35
          },
          {
            "el": "Express 10′ · Redken",
            "en": "Express 10′ · Redken",
            "time": {
              "el": "40′",
              "en": "40′"
            },
            "price": 39
          },
          {
            "el": "έως 6 εβδομάδες · Majirel",
            "en": "up to 6 weeks · Majirel",
            "time": {
              "el": "40′",
              "en": "40′"
            },
            "price": 42
          },
          {
            "el": "χωρίς αμμωνία · INOA / Redken",
            "en": "ammonia-free · INOA / Redken",
            "time": {
              "el": "50′",
              "en": "50′"
            },
            "price": 44
          },
          {
            "el": "μεγάλη ρίζα 6+ εβδομάδες · Majirel",
            "en": "long regrowth 6+ weeks · Majirel",
            "time": {
              "el": "50′",
              "en": "50′"
            },
            "price": 49
          },
          {
            "el": "χωρίς αμμωνία · μεγάλη ρίζα",
            "en": "ammonia-free · long regrowth",
            "time": {
              "el": "50′",
              "en": "50′"
            },
            "price": 55
          }
        ]
      },
      {
        "name": {
          "el": "+ Πολύ πυκνά ή πολύ μακριά μαλλιά",
          "en": "+ Extra long / thick hair"
        },
        "desc": {
          "el": "Προσθήκη στη βαφή για επιπλέον ποσότητα και χρόνο.",
          "en": "Colour add-on for extra product and time."
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "15′",
              "en": "15′"
            },
            "price": 19
          }
        ]
      },
      {
        "name": {
          "el": "Βαφή ρίζας + ρεφλέ (gloss)",
          "en": "Root colour + gloss"
        },
        "options": [
          {
            "el": "κοντά",
            "en": "short",
            "time": {
              "el": "1 ώρα",
              "en": "1 h"
            },
            "price": 52
          },
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "1 ώρα",
              "en": "1 h"
            },
            "price": 64
          },
          {
            "el": "κάτω από τους ώμους",
            "en": "below shoulders",
            "time": {
              "el": "1 ώρα 05′",
              "en": "1 h 05′"
            },
            "price": 79
          }
        ]
      },
      {
        "name": {
          "el": "Ρεφλέ / Gloss – λάμψη & τόνος",
          "en": "Hair gloss & toner"
        },
        "options": [
          {
            "el": "κοντά",
            "en": "short",
            "time": {
              "el": "45′",
              "en": "45′"
            },
            "price": 31
          },
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "50′",
              "en": "50′"
            },
            "price": 43
          },
          {
            "el": "κάτω από τους ώμους",
            "en": "below shoulders",
            "time": {
              "el": "1 ώρα",
              "en": "1 h"
            },
            "price": 53
          }
        ]
      },
      {
        "name": {
          "el": "Διόρθωση χρώματος – διάγνωση",
          "en": "Colour correction consultation"
        },
        "desc": {
          "el": "Πλάνο και συγκεκριμένη τιμή πριν ξεκινήσουμε.",
          "en": "A plan and a set price before we start."
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "1 ώρα 20′",
              "en": "1 h 20′"
            },
            "price": 40
          }
        ]
      }
    ]
  },
  {
    "key": "highlights",
    "title": {
      "el": "Ανταύγειες & Balayage",
      "en": "Highlights & Balayage"
    },
    "services": [
      {
        "name": {
          "el": "Face framing – φως στο πρόσωπο",
          "en": "Face-frame highlights"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "1 ώρα 15′",
              "en": "1 h 15′"
            },
            "price": 46
          }
        ]
      },
      {
        "name": {
          "el": "Balayage ή ανταύγειες – μερικές",
          "en": "Partial balayage & highlights"
        },
        "options": [
          {
            "el": "κοντά",
            "en": "short",
            "time": {
              "el": "1 ώρα 35′",
              "en": "1 h 35′"
            },
            "price": 55
          },
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "1 ώρα 50′",
              "en": "1 h 50′"
            },
            "price": 79
          },
          {
            "el": "κάτω από τους ώμους",
            "en": "below shoulders",
            "time": {
              "el": "2 ώρες",
              "en": "2 h"
            },
            "price": 104
          }
        ]
      },
      {
        "name": {
          "el": "Balayage ή ανταύγειες – ολόκληρες",
          "en": "Full balayage & highlights"
        },
        "options": [
          {
            "el": "κοντά",
            "en": "short",
            "time": {
              "el": "2 ώρες 10′",
              "en": "2 h 10′"
            },
            "price": 76
          },
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "2 ώρες 25′",
              "en": "2 h 25′"
            },
            "price": 100
          },
          {
            "el": "κάτω από τους ώμους",
            "en": "below shoulders",
            "time": {
              "el": "2 ώρες 45′",
              "en": "2 h 45′"
            },
            "price": 126
          }
        ]
      },
      {
        "name": {
          "el": "No-Bleach ανταύγειες – χωρίς ντεκαπάζ",
          "en": "No-bleach highlights"
        },
        "options": [
          {
            "el": "φωτισμός προσώπου · 9–15 τούφες",
            "en": "face frame · 9–15 foils",
            "time": {
              "el": "1 ώρα 20′",
              "en": "1 h 20′"
            },
            "price": 51
          },
          {
            "el": "μερικές · 15–25 τούφες · έως τους ώμους",
            "en": "partial · 15–25 foils · up to shoulders",
            "time": {
              "el": "1 ώρα 50′",
              "en": "1 h 50′"
            },
            "price": 85
          }
        ]
      }
    ]
  },
  {
    "key": "therapies",
    "title": {
      "el": "Θεραπείες",
      "en": "Treatments"
    },
    "services": [
      {
        "name": {
          "el": "Λούσιμο με μασάζ",
          "en": "Shampoo & scalp massage"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "10′",
              "en": "10′"
            },
            "price": 11
          }
        ]
      },
      {
        "name": {
          "el": "+ Θεραπεία ενυδάτωσης ή αναδόμησης",
          "en": "+ Hair treatment"
        },
        "desc": {
          "el": "Προσθήκη σε άλλη υπηρεσία.",
          "en": "Add-on to another service."
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "10′",
              "en": "10′"
            },
            "price": 10
          }
        ]
      },
      {
        "name": {
          "el": "Εντατική θεραπεία με αμπούλα",
          "en": "Intensive ampoule treatment"
        },
        "desc": {
          "el": "Κράτηση τηλεφωνικά ή στο κομμωτήριο.",
          "en": "Book by phone or at the salon."
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "30′",
              "en": "30′"
            },
            "price": 17
          }
        ]
      },
      {
        "name": {
          "el": "Κερατίνη – ίσιωμα",
          "en": "Keratin smoothing"
        },
        "options": [
          {
            "el": "κοντό έως μεσαίο μήκος",
            "en": "short to medium",
            "time": {
              "el": "1 ώρα 45′",
              "en": "1 h 45′"
            },
            "price": 120
          },
          {
            "el": "μεσαίο έως μακρύ μήκος",
            "en": "medium to long",
            "time": {
              "el": "2 ώρες",
              "en": "2 h"
            },
            "price": 150
          },
          {
            "el": "μακρύ μήκος",
            "en": "long",
            "time": {
              "el": "3 ώρες",
              "en": "3 h"
            },
            "price": 170
          }
        ]
      }
    ]
  },
  {
    "key": "packages",
    "title": {
      "el": "Πακέτα",
      "en": "Packages"
    },
    "services": [
      {
        "name": {
          "el": "Κούρεμα & Blowout",
          "en": "Cut & blowout"
        },
        "options": [
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "45′",
              "en": "45′"
            },
            "price": 38
          },
          {
            "el": "κάτω από τους ώμους ή πυκνά",
            "en": "below shoulders or thick",
            "time": {
              "el": "55′",
              "en": "55′"
            },
            "price": 45
          }
        ]
      },
      {
        "name": {
          "el": "Βαφή ρίζας, κούρεμα & Blowout",
          "en": "Colour, cut & blowout"
        },
        "options": [
          {
            "el": "έως τους ώμους",
            "en": "up to shoulders",
            "time": {
              "el": "1 ώρα 30′",
              "en": "1 h 30′"
            },
            "price": 63
          },
          {
            "el": "κάτω από τους ώμους ή πυκνά",
            "en": "below shoulders or thick",
            "time": {
              "el": "1 ώρα 40′",
              "en": "1 h 40′"
            },
            "price": 70
          }
        ]
      },
      {
        "name": {
          "el": "Βαφή ρίζας & Blowout",
          "en": "Root colour & blowout"
        },
        "options": [
          {
            "el": "",
            "en": "",
            "time": {
              "el": "1 ώρα 15′",
              "en": "1 h 15′"
            },
            "price": 52
          }
        ]
      },
      {
        "name": {
          "el": "Balayage, κούρεμα & Blowout",
          "en": "Balayage, cut & blowout"
        },
        "options": [
          {
            "el": "μερικές · έως τους ώμους",
            "en": "partial · up to shoulders",
            "time": {
              "el": "2 ώρες 40′",
              "en": "2 h 40′"
            },
            "price": 100
          },
          {
            "el": "μερικές · κάτω από τους ώμους",
            "en": "partial · below shoulders",
            "time": {
              "el": "3 ώρες 10′",
              "en": "3 h 10′"
            },
            "price": 133
          }
        ]
      }
    ]
  }
];

export default menu;
