/* ==========================================================================
   Platanos Tavern: all editable content lives here.
   Fill in the real details and every page updates. Anything left empty ("")
   shows a dashed "To add" marker on the page so nothing is forgotten.
   Text that has two languages is written { en: "...", el: "..." }.
   ========================================================================== */
window.SITE = {
  name: "Platanos",
  nameEl: "Πλάτανος",
  place: { en: "Chalkoutsi, Greece", el: "Χαλκούτσι, Ελλάδα" },

  /* contact: leave "" until you have it */
  address: { en: "", el: "" },
  phone: "",
  email: "",
  social: { instagram: "", facebook: "" },
  mapsQuery: "Chalkoutsi Greece",

  /* opening hours (Athens time). closedDay uses Mon Tue Wed Thu Fri Sat Sun, or "" for none */
  hours: { closedDay: "Tue", open: "12:00", close: "00:00", openHour: 12, isSample: true },

  /* menu: [English name, Greek name, price in euros] */
  menuIsSample: true,
  menu: [
    { id: "meze", en: "Meze", el: "Μεζέδες", items: [
      ["Tzatziki", "Τζατζίκι", "4.50"], ["Fava with capers", "Φάβα με κάπαρη", "5.00"],
      ["Zucchini fritters", "Κολοκυθοκεφτέδες", "6.50"], ["Boiled wild greens", "Χόρτα βραστά", "5.00"],
      ["Fried cheese", "Σαγανάκι", "7.50"], ["Village salad", "Χωριάτικη σαλάτα", "8.50"] ] },
    { id: "grill", en: "Grill & oven", el: "Ψητά & φούρνου", items: [
      ["Lamb kleftiko", "Αρνί κλέφτικο", "16.00"], ["Pork chops", "Χοιρινές μπριζόλες", "11.00"],
      ["Grilled sausage", "Λουκάνικο ψητό", "8.00"], ["Stuffed tomatoes & peppers", "Γεμιστά", "9.00"],
      ["Moussaka", "Μουσακάς", "10.00"], ["Chicken souvlaki", "Σουβλάκι κοτόπουλο", "9.00"] ] },
    { id: "sweet", en: "Sweets", el: "Γλυκά", items: [
      ["Thyme honey yogurt", "Γιαούρτι με μέλι", "5.00"], ["Orange pie", "Πορτοκαλόπιτα", "5.00"],
      ["Galaktoboureko", "Γαλακτομπούρεκο", "5.50"], ["Spoon sweet", "Γλυκό του κουταλιού", "3.50"] ] },
    { id: "drink", en: "Drinks", el: "Ποτά", items: [
      ["House wine, half litre", "Χύμα κρασί, μισό λίτρο", "7.00"], ["Tsipouro, 100 ml", "Τσίπουρο", "4.00"],
      ["Ouzo", "Ούζο", "4.00"], ["Local beer", "Μπίρα", "4.00"],
      ["Greek coffee", "Ελληνικός καφές", "2.50"], ["Water, 1 litre", "Νερό", "1.00"] ] }
  ],

  /* gallery: swap each slot for a real photo later.
     Put files in an img folder and set src (and, for sharp photos on every phone, srcset), e.g.
       src: "img/tree-800.jpg", srcset: "img/tree-480.jpg 480w, img/tree-800.jpg 800w, img/tree-1200.jpg 1200w"
     Photo tips: export JPG or WebP, 1200px on the long edge, under 200 KB each.
     The slot's shape (r) crops the photo, so keep the subject near the middle. */
  gallery: [
    { en: "The plane tree at noon", el: "Ο πλάτανος το μεσημέρι", r: "4/5", src: "" },
    { en: "The long table", el: "Το μακρύ τραπέζι", r: "1/1", src: "" },
    { en: "Lamb out of the oven", el: "Αρνί από το φούρνο", r: "4/3", src: "" },
    { en: "Evening light", el: "Το φως του απογεύματος", r: "3/4", src: "" },
    { en: "Wine from the carafe", el: "Κρασί από την καράφα", r: "1/1", src: "" },
    { en: "The kitchen", el: "Η κουζίνα", r: "4/5", src: "" },
    { en: "Sweets and coffee", el: "Γλυκό και καφές", r: "4/3", src: "" },
    { en: "The square in Chalkoutsi", el: "Η πλατεία στο Χαλκούτσι", r: "3/4", src: "" },
    { en: "Friends at the table", el: "Παρέα στο τραπέζι", r: "1/1", src: "" }
  ],

  /* people on the story page */
  people: [
    { name: "", role: { en: "Owner", el: "Ιδιοκτήτης" } },
    { name: "", role: { en: "Head cook", el: "Αρχιμάγειρας" } },
    { name: "", role: { en: "Front of house", el: "Σαλόνι" } }
  ]
};
