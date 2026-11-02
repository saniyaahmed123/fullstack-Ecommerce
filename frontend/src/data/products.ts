import bunnyImage from '../assets/dealimages/1.png'
import plushPalImage from '../assets/heroeditorial2.png'
import clayCharmImage from '../assets/2.png'
import nameHoopImage from '../assets/dealimages/3.png'
import giftBoxesImage from '../assets/1.png'
import coastersImage from '../assets/4.png'
import braceletImage from '../assets/dealimages/2.png'
import catMugImage from '../assets/heroeditorial.png'
import cardiganImage from '../assets/dealimages/4.png'
import artPrintImage from '../assets/3.png'
import crochetDetailImage from '../assets/crochet/1.png'
import jewelleryDetailImage from '../assets/jwellery/1.png'
import wearableDetailImage from '../assets/wearable/1.png'
import decorDetailImage from '../assets/decorandwall/1.png'
import clayDetailImage from '../assets/claycraft/1.png'
import keychainDetailImage from '../assets/keychain/1.png'

export type ProductBadge = 'Bestseller' | 'New' | 'Sale'

export interface ProductOption {
  name: string
  values: string[]
}

export interface ProductSeller {
  name: string
  location: string
  rating: number
  reviews: number
  sales: number
  since: string
  initials: string
  color: string
}

export interface Product {
  id: string
  title: string
  category: string
  categoryId: string
  price: number
  currency?: string
  oldPrice?: number
  rating: number
  reviews: number
  badge?: ProductBadge
  images: string[]
  alt: string
  description: string
  details: string[]
  options: ProductOption[]
  seller: ProductSeller
  shipping: {
    cost: string
    estimate: string
    returns: string
  }
}

const rangStudio: ProductSeller = {
  name: 'Rang Studio',
  location: 'Karachi, Pakistan',
  rating: 5.0,
  reviews: 12,
  sales: 32,
  since: '6 months on Handy',
  initials: 'RS',
  color: '#F3B0A8'
}

const hearthAndHue: ProductSeller = {
  name: 'Hearth & Hue',
  location: 'Lahore, Pakistan',
  rating: 4.9,
  reviews: 86,
  sales: 412,
  since: '2 years on Handy',
  initials: 'HH',
  color: '#C3CDC6'
}

const clayAndCo: ProductSeller = {
  name: 'Clay & Co.',
  location: 'Islamabad, Pakistan',
  rating: 4.8,
  reviews: 54,
  sales: 208,
  since: '1 year on Handy',
  initials: 'CC',
  color: '#D9C69C'
}

const noctilune: ProductSeller = {
  name: 'Noctilune',
  location: 'Faisalabad, Pakistan',
  rating: 5.0,
  reviews: 31,
  sales: 147,
  since: '8 months on Handy',
  initials: 'NO',
  color: '#CFDCF2'
}

export const products: Product[] = [
  {
    id: 'crochet-bunny-plush',
    title: 'Crochet Bunny Plush',
    category: 'Playful gifts',
    categoryId: 'crochet',
    price: 24,
    oldPrice: 32,
    rating: 4.9,
    reviews: 1284,
    badge: 'Bestseller',
    images: [bunnyImage, crochetDetailImage, plushPalImage],
    alt: 'Handmade white crochet bunny plush',
    description:
      'A soft, huggable bunny crocheted by hand from premium cotton yarn. Each one is made in small batches with carefully embroidered features, so no two bunnies are exactly alike. A sweet companion for little ones and a thoughtful gift for anyone who loves handmade.',
    details: [
      'Hand crocheted from soft cotton yarn',
      'Embroidered face with safety eyes',
      'Approximately 22 cm tall',
      'Spot clean only'
    ],
    options: [
      { name: 'Size', values: ['Small (18 cm)', 'Medium (22 cm)', 'Large (30 cm)'] },
      { name: 'Colour', values: ['Cream', 'Sage', 'Blush'] }
    ],
    seller: rangStudio,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 4 - 8',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'cuddle-plush-pal',
    title: 'Cuddle Plush Pal',
    category: 'Playful gifts',
    categoryId: 'crochet',
    price: 19.5,
    rating: 4.8,
    reviews: 642,
    badge: 'New',
    images: [plushPalImage, crochetDetailImage, bunnyImage],
    alt: 'Handmade soft plush toy',
    description:
      'A round little friend with a velvety-soft finish and the floppiest ears. Sewn and stuffed by hand in our studio, this plush pal is ready for bedtime stories, road trips and everything in between.',
    details: [
      'Soft minky and cotton blend fabric',
      'Hypoallergenic filling',
      'Approximately 20 cm tall',
      'Machine washable on a gentle cycle'
    ],
    options: [
      { name: 'Size', values: ['Small (15 cm)', 'Medium (20 cm)'] },
      { name: 'Colour', values: ['Oat', 'Dusty rose', 'Sage'] }
    ],
    seller: rangStudio,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 4 - 8',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'clay-portrait-bag-charm',
    title: 'Clay Portrait Bag Charm',
    category: 'Playful gifts',
    categoryId: 'keychains',
    price: 16,
    oldPrice: 21,
    rating: 5.0,
    reviews: 318,
    badge: 'Sale',
    images: [clayCharmImage, clayDetailImage, keychainDetailImage],
    alt: 'Polymer clay portrait bag charm',
    description:
      'A tiny hand-sculpted portrait charm made from polymer clay and finished with a sturdy clasp. Send us a photo and we will turn your favourite person, pet or inside joke into a keepsake small enough to carry everywhere.',
    details: [
      'Hand sculpted polymer clay',
      'Gold-tone clasp and keyring',
      'Approximately 4 cm tall',
      'Made to order in 3 - 5 days'
    ],
    options: [
      { name: 'Style', values: ['Portrait', 'Pet portrait', 'Initials'] },
      { name: 'Clasp', values: ['Gold', 'Silver'] }
    ],
    seller: clayAndCo,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 6 - 10',
      returns: '14-day returns accepted'
    }
  },
  {
    id: 'embroidered-name-hoop',
    title: 'Embroidered Name Hoop',
    category: 'Playful gifts',
    categoryId: 'personalised',
    price: 21,
    rating: 4.9,
    reviews: 874,
    images: [nameHoopImage, giftBoxesImage, coastersImage],
    alt: 'Embroidered personalised name hoop',
    description:
      'A hand-stitched name hoop finished with delicate florals and a hanging ribbon. Personalise it with a name, birth date or short message to create a keepsake for a nursery, wedding or new home.',
    details: [
      'Hand embroidered cotton thread on linen',
      'Wooden hoop with ribbon hanger',
      '20 cm diameter',
      'Personalisation included'
    ],
    options: [
      { name: 'Hoop size', values: ['15 cm', '20 cm', '25 cm'] },
      { name: 'Thread colour', values: ['Terracotta', 'Sage', 'Mustard'] }
    ],
    seller: hearthAndHue,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 5 - 9',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'personalised-keepsake-boxes',
    title: 'Personalised Keepsake Boxes',
    category: 'Personalised keepsakes',
    categoryId: 'personalised',
    price: 14,
    oldPrice: 18,
    rating: 4.8,
    reviews: 512,
    badge: 'Bestseller',
    images: [giftBoxesImage, nameHoopImage, coastersImage],
    alt: 'Personalised fabric-wrapped keepsake boxes',
    description:
      'A set of fabric-wrapped boxes for letters, photographs and all the little things worth keeping. Add a name or short message to the lid for a gift that feels truly personal.',
    details: [
      'Fabric-wrapped recycled board',
      'Set of two nested boxes',
      'Largest box measures 24 x 18 x 9 cm',
      'Personalised lid included'
    ],
    options: [
      { name: 'Set', values: ['Set of 2', 'Set of 3'] },
      { name: 'Fabric', values: ['Linen', 'Gingham', 'Botanical'] }
    ],
    seller: hearthAndHue,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 5 - 9',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'photo-coaster-set',
    title: 'Photo Coaster Set',
    category: 'Personalised keepsakes',
    categoryId: 'home-decor',
    price: 18,
    rating: 4.9,
    reviews: 736,
    images: [coastersImage, giftBoxesImage, artPrintImage],
    alt: 'Personalised photo coaster set',
    description:
      'Turn favourite photographs into a set of sturdy, wipe-clean coasters. Each coaster is printed with a soft matte finish and backed with cork to protect your table.',
    details: [
      'Hardboard with cork backing',
      '9 cm square coasters',
      'Set of four or six',
      'Upload photos after checkout'
    ],
    options: [
      { name: 'Set', values: ['Set of 4', 'Set of 6', 'Set of 8'] },
      { name: 'Finish', values: ['Matte', 'Gloss'] }
    ],
    seller: hearthAndHue,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 5 - 9',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'heart-locket-photo-bracelet',
    title: 'Heart Locket Photo Bracelet',
    category: 'Personalised keepsakes',
    categoryId: 'jewellery',
    price: 32,
    oldPrice: 40,
    rating: 5.0,
    reviews: 967,
    badge: 'Sale',
    images: [braceletImage, jewelleryDetailImage, wearableDetailImage],
    alt: 'Gold heart locket photo bracelet',
    description:
      'A delicate gold-tone bracelet with a heart locket that opens to hold two tiny photographs. A quiet, everyday reminder of the people you love most.',
    details: [
      'Gold-tone stainless steel',
      'Heart locket measures 1.6 cm',
      'Adjustable 16 - 19 cm chain',
      'Two photo inserts included'
    ],
    options: [
      { name: 'Chain length', values: ['16 cm', '18 cm', '20 cm'] },
      { name: 'Metal', values: ['Gold tone', 'Silver tone'] }
    ],
    seller: noctilune,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 4 - 7',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'ceramic-cat-mug',
    title: 'Handmade Ceramic Cat Mug',
    category: 'Cosy home comforts',
    categoryId: 'ceramics',
    price: 22,
    rating: 4.9,
    reviews: 743,
    images: [catMugImage, clayDetailImage, decorDetailImage],
    alt: 'Handmade ceramic cat mug',
    description:
      'A wheel-thrown stoneware mug with a hand-painted cat face and a generous handle. Each mug is glazed by hand, making every piece a little different.',
    details: [
      'Wheel-thrown stoneware',
      'Food-safe glaze',
      'Holds approximately 350 ml',
      'Dishwasher and microwave safe'
    ],
    options: [
      { name: 'Glaze', values: ['Cream', 'Speckled oat', 'Sage'] },
      { name: 'Size', values: ['350 ml', '450 ml'] }
    ],
    seller: clayAndCo,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 6 - 10',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'crochet-sunflower-cardigan',
    title: 'Crochet Sunflower Cardigan',
    category: 'Cosy home comforts',
    categoryId: 'crochet',
    price: 48,
    oldPrice: 62,
    rating: 5.0,
    reviews: 214,
    badge: 'New',
    images: [cardiganImage, crochetDetailImage, wearableDetailImage],
    alt: 'Handmade crochet sunflower cardigan',
    description:
      'A lightweight crochet cardigan covered in hand-stitched sunflowers. Made to order in a soft cotton blend, it is the kind of layer you reach for all year round.',
    details: [
      'Soft cotton blend yarn',
      'Hand-stitched sunflower appliques',
      'Relaxed, boxy fit',
      'Hand wash and dry flat'
    ],
    options: [
      { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      { name: 'Colour', values: ['Cream', 'Butter', 'Sage'] }
    ],
    seller: rangStudio,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 8 - 14',
      returns: '30-day returns accepted'
    }
  },
  {
    id: 'dachshund-scooter-art-print',
    title: 'Dachshund Scooter Art Print',
    category: 'Little gifts under $25',
    categoryId: 'home-decor',
    price: 15,
    oldPrice: 26,
    rating: 4.8,
    reviews: 189,
    badge: 'Sale',
    images: [artPrintImage, decorDetailImage, coastersImage],
    alt: 'Framed dachshund on a scooter art print',
    description:
      'A cheerful illustrated print of a dachshund cruising on a little scooter. Printed on thick, textured paper with rich, archival inks. Frame it for a hallway, kitchen or the perfect tiny gallery wall.',
    details: [
      'Archival pigment print',
      '300 gsm textured paper',
      'Signed on the back',
      'Frame not included'
    ],
    options: [
      { name: 'Size', values: ['A4', 'A3', 'A2'] },
      { name: 'Frame', values: ['Unframed', 'Oak frame', 'Black frame'] }
    ],
    seller: noctilune,
    shipping: {
      cost: 'Free delivery',
      estimate: 'Arrives Nov 4 - 8',
      returns: '30-day returns accepted'
    }
  }
]

export interface ProductCategory {
  id: string
  title: string
  productIds: string[]
}

export const productCategories: ProductCategory[] = [
  {
    id: 'playful',
    title: 'Playful gifts',
    productIds: [
      'crochet-bunny-plush',
      'cuddle-plush-pal',
      'clay-portrait-bag-charm',
      'embroidered-name-hoop'
    ]
  },
  {
    id: 'keepsakes',
    title: 'Personalised keepsakes',
    productIds: [
      'personalised-keepsake-boxes',
      'photo-coaster-set',
      'heart-locket-photo-bracelet',
      'ceramic-cat-mug'
    ]
  },
  {
    id: 'cosy',
    title: 'Cosy home comforts',
    productIds: [
      'crochet-sunflower-cardigan',
      'ceramic-cat-mug',
      'cuddle-plush-pal',
      'photo-coaster-set'
    ]
  },
  {
    id: 'prints',
    title: 'Little gifts under $25',
    productIds: [
      'dachshund-scooter-art-print',
      'clay-portrait-bag-charm',
      'personalised-keepsake-boxes',
      'embroidered-name-hoop'
    ]
  }
]

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    item => item.id !== product.id && item.categoryId === product.categoryId
  )
  const others = products.filter(
    item => item.id !== product.id && item.categoryId !== product.categoryId
  )
  return [...sameCategory, ...others].slice(0, limit)
}
