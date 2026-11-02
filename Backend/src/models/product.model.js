import mongoose from "mongoose";

const CATEGORIES = [
    'jewellery',
    'home-decor',
    'ceramics',
    'personalised',
    'crochet',
    'keychains'
];

const productSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    productName: { type: String, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String },
    desc: { type: String },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: 'PKR' },
    category: { type: String, enum: CATEGORIES, required: true, trim: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    images: [{ type: String }],
    image: { type: String },
    imageKitFileId: { type: String },
    imageKitFileIds: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ['draft', 'active', 'archived'], default: 'active' },
    materials: [{ type: String, trim: true }],
    dimensions: { type: String },
    weight: { type: String },
    colors: [{ type: String, trim: true }],
    sizes: [{ type: String, trim: true }],
    variants: [{ type: mongoose.Schema.Types.Mixed }],
    personalisable: { type: Boolean, default: false },
    personalisationNote: { type: String },
    madeToOrder: { type: Boolean, default: false },
    processingDays: { type: Number },
    shippingFee: { type: Number },
    deliveryDays: { type: Number },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    brand: { type: String, trim: true },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
}, { timestamps: true })

function generateSlugSuffix() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return suffix;
}

productSchema.pre('validate', function(next) {
    try {
        if (!this.name && this.productName) {
            this.name = this.productName;
        }
        if (!this.productName && this.name) {
            this.productName = this.name;
        }
        if (!this.description && this.desc) {
            this.description = this.desc;
        }
        if (!this.desc && this.description) {
            this.desc = this.description;
        }
        if (!this.image && Array.isArray(this.images) && this.images.length > 0) {
            this.image = this.images[0];
        }
        if (Array.isArray(this.images) && this.images.length === 0 && this.image) {
            this.images = [this.image];
        }
        if (!this.seller && this.admin) {
            this.seller = this.admin;
        }
        if (!this.admin && this.seller) {
            this.admin = this.seller;
        }
        if (!this.slug && (this.name || this.productName)) {
            const base = (this.name || this.productName).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            this.slug = base + '-' + generateSlugSuffix();
        } else if (this.slug && !/-[a-z0-9]{4}$/.test(this.slug)) {
            const base = this.slug.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            this.slug = base + '-' + generateSlugSuffix();
        }
        if (typeof next === 'function') next();
    } catch (e) {
        if (typeof next === 'function') return next(e);
        throw e;
    }
});

productSchema.index({ category: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', desc: 'text', tags: 'text' });

const productModel = mongoose.model('product', productSchema)
export default productModel
export { CATEGORIES }
