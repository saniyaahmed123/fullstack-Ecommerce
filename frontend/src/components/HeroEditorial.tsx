import { Link } from 'react-router-dom'
import editorialGift from '../assets/heroeditorial.png'
import editorialMaker from '../assets/heroeditorial2.png'
import './HeroEditorial.css'

export default function HeroEditorial() {
  return (
    <section className="hedit">
      <div className="hedit__inner">
        <div className="hedit__main">
          <div className="hedit__copy">
            <h2 className="hedit__title">
              Thoughtful gifts,
              <br />
              made to delight
            </h2>
            <Link to="/browse" className="hedit__cta">
              Shop gifts
            </Link>
          </div>
          <img
            className="hedit__main-img"
            src={editorialGift}
            alt="Handmade ceramic cat mug"
            loading="lazy"
          />
        </div>

        <Link to="/browse" className="hedit__side">
          <img
            src={editorialMaker}
            alt="Handmade plush toy"
            loading="lazy"
          />
          <div className="hedit__side-overlay">
            <p>
              Discover
              <br />
              new makers
            </p>
            <span>Shop now</span>
          </div>
        </Link>
      </div>
    </section>
  )
}
