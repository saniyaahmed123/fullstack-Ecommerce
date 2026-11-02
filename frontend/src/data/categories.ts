import personalisedImage from '../assets/dealimages/3.png'
import jewelleryImage from '../assets/jwellery/1.png'
import decorImage from '../assets/decorandwall/1.png'
import ceramicsImage from '../assets/claycraft/1.png'
import crochetImage from '../assets/crochet/1.png'
import keychainImage from '../assets/keychain/1.png'

export interface Category {
  id: string
  label: string
  image: string
  alt: string
}

export const categories: Category[] = [
  {
    id: 'jewellery',
    label: 'Jewellery & Accessories',
    image: jewelleryImage,
    alt: 'Handmade jewellery'
  },
  {
    id: 'home-decor',
    label: 'Home Decor & Living',
    image: decorImage,
    alt: 'Handmade home decor'
  },
  {
    id: 'ceramics',
    label: 'Ceramics & Pottery',
    image: ceramicsImage,
    alt: 'Handmade ceramics and pottery'
  },
  {
    id: 'personalised',
    label: 'Personalised Gifts',
    image: personalisedImage,
    alt: 'Personalised name hoop gift'
  },
  {
    id: 'crochet',
    label: 'Crochet Gifts & Soft Toys',
    image: crochetImage,
    alt: 'Handmade crochet gift'
  },
  {
    id: 'keychains',
    label: 'Keychains & Trinkets',
    image: keychainImage,
    alt: 'Handmade keychain'
  }
]
