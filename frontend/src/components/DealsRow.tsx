import dealPlush from '../assets/dealimages/1.png'
import dealJewellery from '../assets/dealimages/2.png'
import dealKeepsakes from '../assets/dealimages/3.png'
import dealKnitwear from '../assets/dealimages/4.png'
import './DealsRow.css'

const deals = [
  {
    id: 1,
    image: dealPlush,
    alt: 'Handmade white crochet plush bunny toy',
    label: 'Sale from',
    big: '5',
    small: '99',
    caption: 'handmade plush toys',
    href: '/browse?category=crochet',
  },
  {
    id: 2,
    image: dealJewellery,
    alt: 'Gold heart locket photo bracelet',
    label: '',
    big: '50',
    small: '%',
    off: true,
    caption: 'personalised jewellery',
    href: '/browse?category=jewellery',
  },
  {
    id: 3,
    image: dealKeepsakes,
    alt: 'Personalised embroidered hoop keepsakes',
    label: 'BOGO',
    big: '25',
    small: '%',
    off: true,
    caption: 'custom keepsakes',
    href: '/browse?category=personalised',
  },
  {
    id: 4,
    image: dealKnitwear,
    alt: 'Handmade crochet sunflower cardigan',
    label: 'BOGO',
    big: '50',
    small: '%',
    off: true,
    caption: 'crochet knitwear',
    href: '/browse?category=crochet',
  },
]

export default function DealsRow() {
  return (
    <section className="deals">
      <div className="deals__inner">
        <h2 className="deals__heading">Just-in-time gift deals</h2>
        <div className="deals__grid">
          {deals.map((deal) => (
            <a key={deal.id} href={deal.href} className="deals__card">
              <div className="deals__img-wrap">
                <img src={deal.image} alt={deal.alt} loading="lazy" />
                <div className="deals__badge">
                  {deal.label && <span className="deals__badge-label">{deal.label}</span>}
                  <span className="deals__badge-value">
                    <span className="deals__badge-big">{deal.big}</span>
                    <span className="deals__badge-side">
                      <span className="deals__badge-small">{deal.small}</span>
                      {deal.off && <span className="deals__badge-off">off</span>}
                    </span>
                  </span>
                </div>
              </div>
              <p className="deals__caption">{deal.caption}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
