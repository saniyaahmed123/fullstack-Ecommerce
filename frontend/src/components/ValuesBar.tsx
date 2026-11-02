import './ValuesBar.css'

const items = [
  {
    tone: 'hand',
    title: 'Handcrafted',
    text: 'Crafted by our family owned business, with care in every detail.',
    icon: (
      <svg className="values__icon" viewBox="0 0 80 92" fill="currentColor" aria-hidden="true">
        <rect x="22" y="22" width="12" height="42" rx="6" />
        <rect x="35" y="10" width="12" height="54" rx="6" />
        <rect x="48" y="16" width="12" height="48" rx="6" />
        <rect x="61" y="30" width="12" height="34" rx="6" />
        <rect x="13" y="42" width="12" height="32" rx="6" transform="rotate(-28 19 58)" />
        <ellipse cx="44" cy="62" rx="23" ry="25" />
      </svg>
    ),
  },
  {
    tone: 'heart',
    title: 'Heartfelt',
    text: 'Each gift is thoughtfully curated to create a personal experience.',
    icon: (
      <svg className="values__icon" viewBox="0 0 100 92" fill="currentColor" aria-hidden="true">
        <path d="M50 86c-3 0-5.6-1.1-7.7-3.1L12.6 55.5C4.9 48.2 2 39.7 4.3 31.4 6.6 23 13.6 17.4 22.4 16.6c8.4-.8 15.9 3 20.3 9.7l7.3 11 7.3-11c4.4-6.7 11.9-10.5 20.3-9.7 8.8.8 15.8 6.4 18.1 14.8 2.3 8.3-.6 16.8-8.3 24.1L57.7 82.9c-2.1 2-4.7 3.1-7.7 3.1z" />
      </svg>
    ),
  },
  {
    tone: 'check',
    title: 'Hassle-free',
    text: 'No lines, no guesswork, no stress — just click, ship, done.',
    icon: (
      <svg className="values__icon" viewBox="0 0 84 84" fill="none" aria-hidden="true">
        <rect width="84" height="84" rx="19" fill="currentColor" />
        <path d="M23 44.5 36.5 58 62 29" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function ValuesBar() {
  return (
    <section className="values" aria-label="Why shop with Handy">
      <div className="values__inner">
        {items.map((item) => (
          <div className="values__item" key={item.title}>
            <span className={`values__icon-wrap values__icon-wrap--${item.tone}`}>
              {item.icon}
            </span>
            <div className="values__copy">
              <h3 className="values__title">{item.title}</h3>
              <p className="values__text">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
