// TODO: connect here
import { Link } from 'react-router-dom'
import hero1 from '../assets/hero1.png'
import hero2 from '../assets/hero2.png'
import hero3 from '../assets/hero3.png'
import hero4 from '../assets/hero4.png'
import './HeroStrip.css'

export default function HeroStrip() {
  return (
    <section className="hero-strip" aria-label="Featured handmade finds">
      {/* Replace these with my own product photos */}
      <div className="hero-strip__grid">
        <Link to="/browse" className="hero-strip__tile" aria-label="Wall art">
          <img src={hero1} alt="Wall art" className="hero-strip__img" loading="eager" />
        </Link>
        <Link to="/browse" className="hero-strip__tile" aria-label="Candles">
          <img src={hero2} alt="Candles" className="hero-strip__img" loading="eager" />
        </Link>
        <Link to="/browse" className="hero-strip__tile" aria-label="Ceramics">
          <img src={hero3} alt="Ceramics" className="hero-strip__img" loading="eager" />
        </Link>
        <Link to="/browse" className="hero-strip__tile" aria-label="Textiles">
          <img src={hero4} alt="Textiles" className="hero-strip__img" loading="eager" />
        </Link>
      </div>
      <div className="hero-strip__divider" />
    </section>
  )
}
