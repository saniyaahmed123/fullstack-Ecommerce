import { Link } from 'react-router-dom'
import heroOne from '../assets/1.png'
import heroTwo from '../assets/2.png'
import heroThree from '../assets/3.png'
import heroFour from '../assets/4.png'
import './HeroGallery.css'

const tiles = [
  { src: heroOne, alt: 'Handmade gift 1' },
  { src: heroTwo, alt: 'Handmade gift 2' },
  { src: heroThree, alt: 'Handmade gift 3' },
  { src: heroFour, alt: 'Handmade gift 4' },
]

export default function HeroGallery() {
  return (
    <section className="hero-strip" aria-label="Featured handmade gifts">
      <div className="hero-strip__grid">
        {tiles.map((tile) => (
          <Link key={tile.src} to="/browse" className="hero-strip__tile">
            <img src={tile.src} alt={tile.alt} className="hero-strip__img" loading="eager" />
          </Link>
        ))}
      </div>
    </section>
  )
}
