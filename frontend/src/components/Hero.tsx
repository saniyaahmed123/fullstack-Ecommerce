import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="container grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1 text-sm text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Handcrafted finds for every mood
        </div>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Find something you’ll love on
          <span className="block text-accent">Mivra</span>
        </h1>
        <p className="max-w-xl text-lg text-text-secondary">
          A curated marketplace of unique pieces made by independent creators. Discover jewelry, decor, and gifts with character.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-medium transition hover:bg-accent/80">
            Shop now
            <ArrowRight className="h-4 w-4" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2 text-sm text-text-secondary transition hover:bg-surface-alt hover:text-text-primary">
            Start selling
          </button>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full bg-accent/20 blur-3xl lg:block" />
        <div className="absolute -right-10 bottom-0 hidden h-48 w-48 rounded-full bg-bg-secondary/40 blur-3xl lg:block" />
        <div className="relative grid gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="h-64 rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-alt" />
            <div className="h-48 rounded-3xl border border-border bg-gradient-to-br from-accent/30 to-surface" />
          </div>
          <div className="mt-6 space-y-4 sm:mt-10">
            <div className="h-48 rounded-3xl border border-border bg-gradient-to-br from-surface-alt to-bg-secondary/60" />
            <div className="h-64 rounded-3xl border border-border bg-gradient-to-br from-accent/20 to-surface-alt" />
          </div>
        </div>
      </div>
    </section>
  )
}
