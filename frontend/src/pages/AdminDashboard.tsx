import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'
import api from '../api/api'
import Footer from '../components/Footer'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import SidebarDrawer from '../components/SidebarDrawer'
import './AccountPages.css'

const categories = [
  ['jewellery', 'Jewellery'],
  ['home-decor', 'Home decor'],
  ['ceramics', 'Ceramics'],
  ['personalised', 'Personalised'],
  ['crochet', 'Crochet'],
  ['keychains', 'Keychains'],
] as const

interface Product {
  _id: string
  name?: string
  productName: string
  description?: string
  desc: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  currency?: string
  category: string
  stock: number
  status: 'draft' | 'active' | 'archived'
  brand?: string
  tags?: string[]
  materials?: string[]
  dimensions?: string
  weight?: string
  colors?: string[]
  sizes?: string[]
  variants?: ProductOption[]
  personalisable?: boolean
  personalisationNote?: string
  madeToOrder?: boolean
  processingDays?: number
  shippingFee?: number
  deliveryDays?: number
  isFeatured?: boolean
  images?: string[]
  image?: string
}

interface ProductOption {
  name: string
  values: string[]
}

interface ProductForm {
  name: string
  description: string
  shortDescription: string
  price: string
  compareAtPrice: string
  currency: string
  category: string
  stock: string
  status: Product['status']
  brand: string
  tags: string
  materials: string
  dimensions: string
  weight: string
  colors: string
  sizes: string
  variants: ProductOption[]
  personalisable: boolean
  personalisationNote: string
  madeToOrder: boolean
  processingDays: string
  shippingFee: string
  deliveryDays: string
  isFeatured: boolean
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  shortDescription: '',
  price: '',
  compareAtPrice: '',
  currency: 'PKR',
  category: '',
  stock: '0',
  status: 'active',
  brand: '',
  tags: '',
  materials: '',
  dimensions: '',
  weight: '',
  colors: '',
  sizes: '',
  variants: [],
  personalisable: false,
  personalisationNote: '',
  madeToOrder: false,
  processingDays: '',
  shippingFee: '',
  deliveryDays: '',
  isFeatured: false,
}

function listText(values?: string[]) {
  return values?.join(', ') || ''
}

function getErrorMessage(error: unknown, fallback: string) {
  return axios.isAxiosError(error) ? error.response?.data?.message || fallback : fallback
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<ProductForm>(emptyForm)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const fileInput = useRef<HTMLInputElement>(null)

  const loadProducts = useCallback(async () => {
    const { data } = await api.get<{ products: Product[] }>('/api/product/admin/all')
    setProducts(data.products)
  }, [])

  const imagePreviews = useMemo(
    () => selectedImages.map(file => ({ file, url: URL.createObjectURL(file) })),
    [selectedImages]
  )

  const visibleProducts = products.filter(product => {
    const matchesSearch = `${product.name || product.productName} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesSearch && (statusFilter === 'all' || product.status === statusFilter)
  })

  useEffect(() => () => {
    imagePreviews.forEach(({ url }) => URL.revokeObjectURL(url))
  }, [imagePreviews])

  useEffect(() => {
    loadProducts()
      .catch(requestError => setError(getErrorMessage(requestError, 'Could not load products. Please try again.')))
      .finally(() => setLoading(false))
  }, [loadProducts])

  function updateField<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function updateVariant(index: number, field: 'name' | 'values', value: string) {
    setForm(current => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) => variantIndex === index
        ? { ...variant, [field]: field === 'values' ? value.split(',').map(item => item.trim()).filter(Boolean) : value }
        : variant),
    }))
  }

  function chooseImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || [])
    if (files.length + existingImages.length > 10) {
      setError('You can add up to 10 images per product.')
      event.target.value = ''
      setSelectedImages([])
      return
    }
    setError('')
    setSelectedImages(files)
  }

  function editProduct(product: Product) {
    setEditingId(product._id)
    setForm({
      ...emptyForm,
      name: product.name || product.productName || '',
      description: product.description || product.desc || '',
      shortDescription: product.shortDescription || '',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice === undefined ? '' : String(product.compareAtPrice),
      currency: product.currency || 'PKR',
      category: product.category,
      stock: String(product.stock),
      status: product.status || 'active',
      brand: product.brand || '',
      tags: listText(product.tags),
      materials: listText(product.materials),
      dimensions: product.dimensions || '',
      weight: product.weight || '',
      colors: listText(product.colors),
      sizes: listText(product.sizes),
      variants: Array.isArray(product.variants) ? product.variants : [],
      personalisable: product.personalisable || false,
      personalisationNote: product.personalisationNote || '',
      madeToOrder: product.madeToOrder || false,
      processingDays: product.processingDays === undefined ? '' : String(product.processingDays),
      shippingFee: product.shippingFee === undefined ? '' : String(product.shippingFee),
      deliveryDays: product.deliveryDays === undefined ? '' : String(product.deliveryDays),
      isFeatured: product.isFeatured || false,
    })
    setExistingImages(product.images?.length ? product.images : product.image ? [product.image] : [])
    setSelectedImages([])
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(emptyForm)
    setSelectedImages([])
    setExistingImages([])
    setEditingId(null)
    if (fileInput.current) fileInput.current.value = ''
  }

  async function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (selectedImages.length + existingImages.length === 0) {
      setError('Choose at least one product image.')
      return
    }

    const parsedVariants = form.variants
      .map(variant => ({ name: variant.name.trim(), values: variant.values.filter(Boolean) }))
      .filter(variant => variant.name && variant.values.length > 0)
    if (form.variants.some(variant => (variant.name.trim() || variant.values.length > 0)
      && (!variant.name.trim() || variant.values.length === 0))) {
      setError('Give each product option a name and at least one value.')
      return
    }

    const formData = new FormData()
    const scalarFields: (keyof ProductForm)[] = [
      'name', 'description', 'shortDescription', 'price', 'compareAtPrice', 'currency',
      'category', 'stock', 'status', 'brand', 'dimensions', 'weight',
      'personalisable', 'personalisationNote', 'madeToOrder',
      'processingDays', 'shippingFee', 'deliveryDays', 'isFeatured',
    ]
    for (const key of scalarFields) {
      formData.append(key, String(form[key]))
    }
    for (const key of ['tags', 'materials', 'colors', 'sizes'] as const) {
      formData.append(key, JSON.stringify(form[key].split(',').map(value => value.trim()).filter(Boolean)))
    }
    formData.append('variants', JSON.stringify(parsedVariants))
    formData.append('imageUrls', JSON.stringify(existingImages))
    selectedImages.forEach(file => formData.append('images', file))

    setSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/api/product/${editingId}`, formData)
      } else {
        await api.post('/api/product/create', formData)
      }
      resetForm()
      await loadProducts()
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Could not save product. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete "${product.name || product.productName}" and its uploaded images? This cannot be undone.`)) return
    setError('')
    setDeletingId(product._id)
    try {
      await api.delete(`/api/product/${product._id}`)
      if (editingId === product._id) resetForm()
      await loadProducts()
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Could not delete product. Please try again.'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="admin-page">
        <header className="admin-tools-header">
          <div>
            <h1>Product administration</h1>
            <p className="cart-intro">Create and manage every product in your store.</p>
          </div>
          <a className="admin-tools-link" href="#admin-products-title">View all products ({products.length})</a>
        </header>
        <div className="admin-product-stats" aria-label="Product totals">
          <div><strong>{products.length}</strong><span>All products</span></div>
          <div><strong>{products.filter(product => product.status === 'active').length}</strong><span>Active</span></div>
          <div><strong>{products.filter(product => product.status === 'draft').length}</strong><span>Drafts</span></div>
        </div>
        {error && <p className="account-error admin-tools-error" role="alert">{error}</p>}

        <form className="admin-form admin-product-form" onSubmit={submitProduct}>
          <h2>{editingId ? 'Edit product' : 'Create a product'}</h2>
          <h3 className="admin-form__section-title">Product details</h3>
          <label>
            Product name
            <input value={form.name} onChange={event => updateField('name', event.target.value)} required />
          </label>
          <label>
            Category
            <select value={form.category} onChange={event => updateField('category', event.target.value)} required>
              <option value="">Choose a category</option>
              {categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
          <label>
            Price
            <input type="number" min="0" step="0.01" value={form.price} onChange={event => updateField('price', event.target.value)} required />
          </label>
          <label>
            Compare-at price
            <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={event => updateField('compareAtPrice', event.target.value)} />
          </label>
          <label>
            Currency
            <input value={form.currency} onChange={event => updateField('currency', event.target.value)} required />
          </label>
          <label>
            Stock
            <input type="number" min="0" step="1" value={form.stock} onChange={event => updateField('stock', event.target.value)} required />
          </label>
          <label>
            Listing status
            <select value={form.status} onChange={event => updateField('status', event.target.value as Product['status'])}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.isFeatured} onChange={event => updateField('isFeatured', event.target.checked)} />
            Feature this product
          </label>
          <label>
            Brand
            <input value={form.brand} onChange={event => updateField('brand', event.target.value)} />
          </label>
          <h3 className="admin-form__section-title">Description and options</h3>
          <label className="admin-form__wide">
            Description
            <textarea value={form.description} onChange={event => updateField('description', event.target.value)} required />
          </label>
          <label className="admin-form__wide">
            Short description
            <input value={form.shortDescription} onChange={event => updateField('shortDescription', event.target.value)} />
          </label>
          <label>
            Tags (comma-separated)
            <input value={form.tags} onChange={event => updateField('tags', event.target.value)} />
          </label>
          <label>
            Materials (comma-separated)
            <input value={form.materials} onChange={event => updateField('materials', event.target.value)} />
          </label>
          <label>
            Dimensions
            <input value={form.dimensions} onChange={event => updateField('dimensions', event.target.value)} />
          </label>
          <label>
            Weight
            <input value={form.weight} onChange={event => updateField('weight', event.target.value)} />
          </label>
          <label>
            Colors (comma-separated)
            <input value={form.colors} onChange={event => updateField('colors', event.target.value)} />
          </label>
          <label>
            Sizes (comma-separated)
            <input value={form.sizes} onChange={event => updateField('sizes', event.target.value)} />
          </label>
          <label className="admin-form__wide">
            Product options (for example: Color — Blue, Green)
            <div className="admin-options-list">
              {form.variants.map((variant, index) => (
                <div className="admin-option-row" key={`option-${index}`}>
                  <label>
                    Option name
                    <input value={variant.name} placeholder="Color" onChange={event => updateVariant(index, 'name', event.target.value)} />
                  </label>
                  <label>
                    Values (comma-separated)
                    <input value={variant.values.join(', ')} placeholder="Blue, Green" onChange={event => updateVariant(index, 'values', event.target.value)} />
                  </label>
                  <button type="button" className="admin-option-remove" onClick={() => updateField('variants', form.variants.filter((_, optionIndex) => optionIndex !== index))}>
                    Remove option
                  </button>
                </div>
              ))}
              <button type="button" className="admin-option-add" onClick={() => updateField('variants', [...form.variants, { name: '', values: [] }])}>
                Add an option
              </button>
            </div>
          </label>
          <h3 className="admin-form__section-title">Personalisation and delivery</h3>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.personalisable} onChange={event => updateField('personalisable', event.target.checked)} />
            Personalisation available
          </label>
          <label>
            Personalisation note
            <input value={form.personalisationNote} onChange={event => updateField('personalisationNote', event.target.value)} />
          </label>
          <label className="admin-checkbox">
            <input type="checkbox" checked={form.madeToOrder} onChange={event => updateField('madeToOrder', event.target.checked)} />
            Made to order
          </label>
          <label>
            Processing days
            <input type="number" min="0" step="1" value={form.processingDays} onChange={event => updateField('processingDays', event.target.value)} />
          </label>
          <label>
            Shipping fee
            <input type="number" min="0" step="0.01" value={form.shippingFee} onChange={event => updateField('shippingFee', event.target.value)} />
          </label>
          <label>
            Delivery days
            <input type="number" min="0" step="1" value={form.deliveryDays} onChange={event => updateField('deliveryDays', event.target.value)} />
          </label>
          <h3 className="admin-form__section-title">Product images</h3>
          <label className="admin-form__wide">
            Product images (up to 10, 5 MB each)
            <input ref={fileInput} type="file" accept="image/*" multiple onChange={chooseImages} />
            <small>Choose clear product photos. New images are added to the existing images.</small>
          </label>
          {existingImages.length > 0 && (
            <fieldset className="admin-image-list admin-form__wide">
              <legend>Current images — uncheck any to remove</legend>
              {existingImages.map((image, index) => (
                <label key={`${image}-${index}`}>
                  <input
                    type="checkbox"
                    checked={existingImages.some((item, itemIndex) => item === image && itemIndex === index)}
                    onChange={event => setExistingImages(current => event.target.checked ? [...current, image] : current.filter((_, itemIndex) => itemIndex !== index))}
                  />
                  <img src={image} alt={`Product image ${index + 1}`} />
                </label>
              ))}
            </fieldset>
          )}
          {imagePreviews.length > 0 && (
            <div className="admin-new-images admin-form__wide" aria-label="New image previews">
              {imagePreviews.map(({ file, url }) => <img src={url} alt={file.name} key={`${file.name}-${file.lastModified}`} />)}
            </div>
          )}
          {selectedImages.length > 0 && <p className="admin-form-note admin-form__wide">{selectedImages.length} new image(s) selected.</p>}
          <div className="admin-form-actions">
            <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}</button>
            {editingId && <button type="button" className="admin-cancel-button" onClick={resetForm}>Cancel edit</button>}
          </div>
        </form>

        <section aria-labelledby="admin-products-title">
          <h2 id="admin-products-title">All products ({products.length})</h2>
          <div className="admin-product-filters">
            <label>
              Search products
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Name or category" />
            </label>
            <label>
              Status
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </label>
          </div>
          {loading && <p>Loading products...</p>}
          {!loading && products.length === 0 && <p>No products have been created yet.</p>}
          {!loading && products.length > 0 && visibleProducts.length === 0 && <p>No products match those filters.</p>}
          <div className="admin-products">
            {visibleProducts.map(product => (
              <article className="admin-product admin-product-row" key={product._id}>
                <img src={product.image || product.images?.[0]} alt={product.name || product.productName} />
                <div>
                  <h3>{product.name || product.productName}</h3>
                  <p>{product.currency || 'PKR'} {product.price.toLocaleString()} · {product.category} · Stock: {product.stock} · {product.status}</p>
                  <p>{product.images?.length || (product.image ? 1 : 0)} image(s)</p>
                </div>
                <div className="admin-product-actions">
                  <button type="button" disabled={submitting} onClick={() => editProduct(product)}>Edit</button>
                  <button type="button" disabled={deletingId === product._id || submitting} onClick={() => deleteProduct(product)}>
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
