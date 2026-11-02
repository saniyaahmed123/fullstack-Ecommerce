const categories = [
  'Jewelry',
  'Home & Living',
  'Clothing',
  'Accessories',
  'Art & Collectibles',
  'Craft Supplies',
  'Gifts',
]

export default function CategoryNav() {
  return (
    <div className="border-b border-border bg-surface/40">
      <div className="container flex flex-wrap items-center justify-center gap-3 py-2 text-sm text-text-secondary sm:justify-start">
        {categories.map((category) => (
          <button key={category} className="rounded-full px-3 py-1 transition hover:bg-surface-alt hover:text-text-primary">
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
