window.PREISSCAN_DATA = {
  region: {
    label: "Mannheim 68219, Brühl und Umgebung"
  },

  markets: [
    {
      id:"lidl", name:"Lidl", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/500px-Lidl-Logo.svg.png"
    },
    {
      id:"aldi", name:"ALDI Süd", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/Aldi_S%C3%BCd_2017_logo.svg/500px-Aldi_S%C3%BCd_2017_logo.svg.png"
    },
    {
      id:"penny", name:"PENNY", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Penny-Logo.svg/500px-Penny-Logo.svg.png"
    },
    {
      id:"netto", name:"Netto", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Netto_logo.svg/330px-Netto_logo.svg.png"
    },
    {
      id:"rewe", name:"REWE", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Logo_REWE.svg/330px-Logo_REWE.svg.png"
    },
    {
      id:"norma", name:"NORMA", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Norma_Logo.svg/330px-Norma_Logo.svg.png"
    },
    {
      id:"edeka", name:"EDEKA", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Edeka_Logo_Aktuell.svg/500px-Edeka_Logo_Aktuell.svg.png"
    },
    {
      id:"globus", name:"GLOBUS", area:"Region Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Globus-Holding-2022.svg/330px-Globus-Holding-2022.svg.png"
    },
    {
      id:"marktkauf", name:"Marktkauf", area:"Region Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Marktkauf.svg/500px-Marktkauf.svg.png"
    },
    {
      id:"kaufland", name:"Kaufland", area:"Mannheim",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/Logo_Kaufland.svg/330px-Logo_Kaufland.svg.png"
    },
    {
      id:"scheck-bruehl", name:"Scheck-in Center", area:"Brühl",
      logo:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/ScheckIn_Center.svg/330px-ScheckIn_Center.svg.png"
    },
    {
      id:"mk-wohl", name:"Marktkauf", branch:"Scheck-in Mannheim-Wohlgelegen", area:"Mannheim-Wohlgelegen",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Marktkauf.svg/500px-Marktkauf.svg.png"
    },
    {
      id:"mk-neck", name:"Marktkauf", branch:"Scheck-in Mannheim-Neckarau", area:"Mannheim-Neckarau",
      logo:"https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Marktkauf.svg/500px-Marktkauf.svg.png"
    }
  ],

  products: [
    {
      id:"coke125",
      family:"coca-cola-zero",
      name:"Coca-Cola Zero Sugar",
      size:"1,25 l",
      packageType:"PET-Einwegflasche",
      unitType:"volume",
      amount:1.25,
      unit:"l",
      image:"https://www.dropwinkel.eu/media/cache/gallery_zoom/product/3130/coca-cola-zero-pet-12-x-125-liter.jpg",
      imageLabel:"Coca-Cola Zero 1,25 l",
      defaultAlarm:1.00,
      marketStates:{}
    },
    {
      id:"coke150",
      family:"coca-cola-zero",
      name:"Coca-Cola Zero Sugar",
      size:"1,5 l",
      packageType:"PET-Flasche",
      unitType:"volume",
      amount:1.5,
      unit:"l",
      image:"https://d17zv3ray5yxvp.cloudfront.net/variants/PUA9MBF1UekggKmvFrnXFChQ/51b8aa181ad15015651703a4356668224748770ff8b1ba318f5b3051f549af07",
      imageLabel:"Coca-Cola Zero 1,5 l",
      defaultAlarm:null,
      marketStates:{}
    },
    {
      id:"monster-rossi",
      family:"monster-rossi",
      name:"Monster Energy VR46 Rossi Edition",
      size:"0,5 l Dose",
      packageType:"Dose",
      unitType:"volume",
      amount:0.5,
      unit:"l",
      image:"https://web-assests.monsterenergy.com/mnst/f1065fb5-d076-4ddc-8131-70ff7ba28e3c.png",
      imageLabel:"Monster Energy Rossi Edition 0,5 l",
      defaultAlarm:null,
      marketStates:{
        lidl:{status:"na", checked:null},
        aldi:{status:"na", checked:null}
      }
    }
  ],

  catalog: [
    {
      id:"coke033-can", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"0,33 l", packageType:"Dose", unitType:"volume", amount:0.33, unit:"l",
      image:"https://www.coca-cola.com/content/dam/onexp/de/de/home-images/coca-cola-zero-sugar/5000112552195.png"
    },
    {
      id:"coke050", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"0,5 l", packageType:"Flasche", unitType:"volume", amount:0.5, unit:"l",
      image:"https://www.coca-cola.com/content/dam/onexp/de/de/home-images/coca-cola-zero-sugar/5000112552195.png"
    },
    {
      id:"coke085", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"0,85 l", packageType:"PET-Einwegflasche", unitType:"volume", amount:0.85, unit:"l",
      image:"https://www.coca-cola.com/content/dam/onexp/de/de/home-images/coca-cola-zero-sugar/5000112552195.png"
    },
    {
      id:"coke100", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"1,0 l", packageType:"Mehrwegflasche", unitType:"volume", amount:1, unit:"l",
      image:"https://www.coca-cola.com/content/dam/onexp/de/de/home-images/coca-cola-zero-sugar/5000112552195.png"
    },
    {
      id:"coke125", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"1,25 l", packageType:"PET-Einwegflasche", unitType:"volume", amount:1.25, unit:"l",
      image:"https://www.dropwinkel.eu/media/cache/gallery_zoom/product/3130/coca-cola-zero-pet-12-x-125-liter.jpg"
    },
    {
      id:"coke150", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"1,5 l", packageType:"PET-Flasche", unitType:"volume", amount:1.5, unit:"l",
      image:"https://d17zv3ray5yxvp.cloudfront.net/variants/PUA9MBF1UekggKmvFrnXFChQ/51b8aa181ad15015651703a4356668224748770ff8b1ba318f5b3051f549af07"
    },
    {
      id:"coke200", family:"coca-cola-zero", searchTerms:["coca cola zero","coca-cola zero","coke zero"],
      name:"Coca-Cola Zero Sugar", size:"2,0 l", packageType:"PET-Einwegflasche", unitType:"volume", amount:2, unit:"l",
      image:"https://www.coca-cola.com/content/dam/onexp/de/de/home-images/coca-cola-zero-sugar/5000112552195.png"
    },

    {id:"hack-mix-250", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"250 g", packageType:"Packung", unitType:"weight", amount:250, unit:"g"},
    {id:"hack-mix-400", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"400 g", packageType:"Packung", unitType:"weight", amount:400, unit:"g"},
    {id:"hack-mix-500", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"500 g", packageType:"Packung", unitType:"weight", amount:500, unit:"g"},
    {id:"hack-mix-600", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"600 g", packageType:"Packung", unitType:"weight", amount:600, unit:"g"},
    {id:"hack-mix-800", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"800 g", packageType:"Packung", unitType:"weight", amount:800, unit:"g"},
    {id:"hack-mix-1000", family:"hackfleisch-gemischt", searchTerms:["gemischtes hackfleisch","hackfleisch gemischt","hack gemischt"], name:"Gemischtes Hackfleisch", size:"1000 g", packageType:"Packung", unitType:"weight", amount:1000, unit:"g"}
  ],

  futureOffers: []
};
