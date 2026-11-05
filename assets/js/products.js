/* ============================================================
   CONFIGURATION DE LA BOUTIQUE : seul fichier à modifier
   ============================================================ */
const SITE = {
  name: "Kaïra Boutique",
  // >>> VOTRE NUMÉRO WHATSAPP : indicatif pays + numéro, sans "+" ni espaces <<<
  whatsapp: "2250717142247",
  whatsappAffiche: "+225 07 17 14 22 47"
};

/* CATALOGUE : pour ajouter un produit, copiez un bloc { ... }, collez-le à la suite
   (avec une virgule), déposez la photo dans assets/images/ et renseignez son nom.
   PRIX : écrivez le prix en FCFA (ex. price: 2500). Tant que price vaut null, le site
   affiche « Prix sur demande » et propose seulement « Demander le prix sur WhatsApp ».
   Dès qu'un prix est renseigné, « Ajouter au panier » apparaît automatiquement. */
const PRODUCTS = [
  { id: "baya-lavande-001", name: "Baya Lavande", category: "Lavande", description: "Baya violet lavande avec perles délicates et détails argentés.",
    price: 1500, available: true, image: "assets/images/baya-lavande.jpg", featured: true },
  { id: "baya-rouge-cristal", name: "Baya Rouge Cristal", category: "Rouge", description: "Perles cristal rouge facettées, rondelles argentées et pendentif lune et étoile.",
    price: null, available: true, image: "assets/images/baya-rouge-cristal.jpg", featured: true },
  { id: "baya-blanc-papillons", name: "Baya Blanc Papillons", category: "Blanc", description: "Perles blanches allongées, papillons transparents, perles lettres et pendentif cœur.",
    price: null, available: true, image: "assets/images/baya-blanc-papillons.jpg", featured: true },
  { id: "baya-bleu-coquillage", name: "Baya Bleu Coquillage", category: "Bleu", description: "Perles bleu turquoise avec fleur, coquillage cauri et pendentif chat.",
    price: null, available: true, image: "assets/images/baya-bleu-coquillage.jpg", featured: false },
  { id: "baya-rouge-fleur", name: "Baya Rouge Fleur", category: "Rouge", description: "Perles rouge vif facettées avec petite fleur et pendentif chat.",
    price: null, available: true, image: "assets/images/baya-rouge-fleur.jpg", featured: false },
  { id: "baya-noir-or", name: "Baya Noir & Or", category: "Noir & or", description: "Perles noires aux détails dorés et pendentif étoile noire.",
    price: null, available: true, image: "assets/images/baya-noir-or.jpg", featured: false }
];

/* GUIDE DES TAILLES (mesures en cm, d'après votre tableau). Modifiez ici si besoin. */
const SIZE_LABEL = "Mesure (cm)";
const SIZES = [["XS", "61-69"], ["S", "70-76"], ["M", "79-84"], ["L", "86-92"], ["XL", "94-99"], ["XXL", "102-107"],
  ["3XL", "110-115"], ["4XL", "117-122"], ["5XL", "125-130"], ["6XL", "132-137"], ["7XL", "140-145"], ["8XL", "147-150"]];

/* VIDÉOS PUBLICITAIRES : une ligne par vidéo (fichier .mp4 dans assets/videos, image de couverture dans assets/images). */
const VIDEOS = [
  { src: "assets/videos/baya-promo.mp4", poster: "assets/images/baya-promo-poster.jpg", title: "Baya rouge et noir" },
  { src: "assets/videos/pub-07.mp4", poster: "assets/images/pub-07.jpg", title: "Papillons lumineux" },
  { src: "assets/videos/pub-02.mp4", poster: "assets/images/pub-02.jpg", title: "Baya rouge, pendentif cœur" },
  { src: "assets/videos/pub-05.mp4", poster: "assets/images/pub-05.jpg", title: "Baya blanc papillons" },
  { src: "assets/videos/pub-03.mp4", poster: "assets/images/pub-03.jpg", title: "Baya noir et or" },
  { src: "assets/videos/pub-08.mp4", poster: "assets/images/pub-08.jpg", title: "Baya rouge trois rangs" },
  { src: "assets/videos/pub-06.mp4", poster: "assets/images/pub-06.jpg", title: "Baya rouge et rose" },
  { src: "assets/videos/pub-09.mp4", poster: "assets/images/pub-09.jpg", title: "Perles noires et dorées" },
  { src: "assets/videos/pub-10.mp4", poster: "assets/images/pub-10.jpg", title: "Perles lavande et cœur" },
  { src: "assets/videos/pub-04.mp4", poster: "assets/images/pub-04.jpg", title: "Rangs rose, bleu et blanc" },
  { src: "assets/videos/pub-01.mp4", poster: "assets/images/pub-01.jpg", title: "Papillons dans le noir" }
];
