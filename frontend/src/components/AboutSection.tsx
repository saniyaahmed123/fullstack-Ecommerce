import { Link } from 'react-router-dom'
import gifting from '../assets/giftsgiving.png'
import delivery from '../assets/delivery.png'
import illustration from '../assets/videoframe_5868.png'
import './AboutSection.css'

export default function AboutSection() {
  return (
    <section className="about">
      <div className="about__inner">
        <div className="about__copy">
          <p className="about__eyebrow">Meet the makers</p>
          <h2 className="about__title">Gifts made slowly, given with love</h2>
          <p className="about__text">
            Handy is a little corner of the internet where independent makers share
            what they love to create. Every piece is made in small batches, packed
            by hand, and sent straight from their workbench to your door.
          </p>
          <Link to="/browse" className="about__cta">
            Meet our makers
            <span className="about__arrow" aria-hidden="true">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="about__grid">
          <img
            className="about__img about__img--one"
            src={illustration}
            alt="Illustration of a gift box filled with flowers and garden friends"
            loading="lazy"
          />
          <img
            className="about__img about__img--two"
            src={delivery}
            alt="A person carrying two hand-packed parcels to the door"
            loading="lazy"
          />
          <img
            className="about__img about__img--three"
            src={gifting}
            alt="Two people exchanging a hand-wrapped gift"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
