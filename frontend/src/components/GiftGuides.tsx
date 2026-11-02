import { Link } from 'react-router-dom'
import guidePlush from '../assets/dealimages/1.png'
import guideBracelet from '../assets/dealimages/2.png'
import guideHoops from '../assets/dealimages/3.png'
import guideCardigan from '../assets/dealimages/4.png'
import guideMug from '../assets/heroeditorial.png'
import guideToy from '../assets/heroeditorial2.png'
import './GiftGuides.css'

const guides = [
  {
    id: 1,
    image: guidePlush,
    alt: 'Handmade crochet plush bunny',
    title: 'Top 100 Handmade Finds',
    href: '/browse?category=crochet',
  },
  {
    id: 2,
    image: guideBracelet,
    alt: 'Gold heart locket photo bracelet',
    title: 'Personalised Gifts',
    href: '/browse?category=personalised',
  },
  {
    id: 3,
    image: guideHoops,
    alt: 'Embroidered personalised hoop keepsakes',
    title: 'Most Whimsical Finds',
    href: '/browse?category=personalised',
  },
  {
    id: 4,
    image: guideCardigan,
    alt: 'Crochet sunflower cardigan',
    title: 'Top 100 Christmas Presents',
    href: '/browse?category=crochet',
  },
  {
    id: 5,
    image: guideMug,
    alt: 'Handmade ceramic cat mug',
    title: 'Birthday Gifts',
    href: '/browse?category=ceramics',
  },
  {
    id: 6,
    image: guideToy,
    alt: 'Handmade plush toy',
    title: 'Gifts for Homebodies',
    href: '/browse?category=home-decor',
  },
]

export default function GiftGuides() {
  return (
    <section className="guides">
      <div className="guides__band">
        <h2 className="guides__title">Handy&rsquo;s Best Gift Guides</h2>
        <p className="guides__subtitle">
          Find meaningful gifts straight from extraordinary small shops, for the
          people who matter most.
        </p>
      </div>
      <div className="guides__row">
        {guides.map((guide) => (
          <Link key={guide.id} to={guide.href} className="guides__item">
            <span className="guides__circle">
              <img src={guide.image} alt={guide.alt} loading="lazy" />
            </span>
            <span className="guides__label">
              {guide.title}
              <span className="guides__arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
