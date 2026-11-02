import productModel from '../models/product.model.js'
import uploadFile, { deleteFile } from '../services/storage.service.js'

const ALLOWED_CATEGORIES = ['jewellery', 'home-decor', 'ceramics', 'personalised', 'crochet', 'keychains'];

function getUploadedFiles(req) {
    return [...(req.files?.images || []), ...(req.files?.image || [])]
}

function parseArray(value) {
    if (value === undefined || value === null || value === '') return []
    if (Array.isArray(value)) return value
    try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) return parsed
    } catch {
        // Comma-separated form fields are also accepted.
    }
    return String(value).split(',').map(item => item.trim()).filter(Boolean)
}

async function removeUploadedFiles(fileIds) {
    for (const fileId of fileIds) {
        await deleteFile(fileId)
    }
}

export async function createProduct(req, res) {
    const uploadedFiles = []
    try {
        const user = req.user
        const files = getUploadedFiles(req)
        if (files.length === 0) {
            return res.status(400).json({ message: 'at least one image is required' })
        }
        if (files.length > 10) {
            return res.status(400).json({ message: 'a product can have at most 10 images' })
        }

        const {
            name,
            productName,
            description,
            desc,
            shortDescription,
            price,
            compareAtPrice,
            category,
            stock,
            status,
            brand,
            tags,
            materials,
            personalisable,
            personalisationNote,
            madeToOrder,
            processingDays,
            shippingFee,
            deliveryDays,
            images,
            imageUrls,
            dimensions,
            weight,
            colors,
            sizes,
            variants,
            isFeatured,
            currency
        } = req.body

        const productTitle = name || productName
        const productDesc = description || desc

        if (!productTitle?.trim()) {
            return res.status(400).json({ message: 'product name is required' })
        }
        if (price === undefined || price === null || price === '') {
            return res.status(400).json({ message: 'price missing' })
        }
        const priceNum = Number(price)
        if (!Number.isFinite(priceNum) || priceNum < 0) {
            return res.status(400).json({ message: 'negative or not a number' })
        }

        if (!category) {
            return res.status(400).json({ message: 'category not in the six' })
        }
        const categoryTrimmed = String(category).trim()
        if (!ALLOWED_CATEGORIES.includes(categoryTrimmed)) {
            return res.status(400).json({ message: 'category not in the six' })
        }

        if (!productDesc || !String(productDesc).trim()) {
            return res.status(400).json({ message: 'missing description or images' })
        }

        if (stock !== undefined && stock !== null && stock !== '') {
            const stockNum = Number(stock)
            if (Number.isNaN(stockNum) || stockNum < 0) {
                return res.status(400).json({ message: 'stock negative' })
            }
        }

        const parsedTags = parseArray(tags)
        const parsedMaterials = parseArray(materials)
        const parsedColors = parseArray(colors)
        const parsedSizes = parseArray(sizes)
        const parsedVariants = parseArray(variants)
        const imageArray = parseArray(imageUrls ?? images)

        const productData = {
            name: productTitle?.trim(),
            productName: productTitle?.trim(),
            description: productDesc,
            desc: productDesc,
            shortDescription: shortDescription?.trim(),
            price: priceNum,
            compareAtPrice: compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice !== '' ? Number(compareAtPrice) : undefined,
            currency: currency || 'PKR',
            category: categoryTrimmed,
            stock: stock !== undefined && stock !== null && stock !== '' ? Number(stock) : 0,
            status: status || 'active',
            brand: brand ? brand.trim() : undefined,
            tags: parsedTags,
            images: imageArray,
            materials: parsedMaterials,
            dimensions: dimensions?.trim(),
            weight: weight?.trim(),
            colors: parsedColors,
            sizes: parsedSizes,
            variants: parsedVariants,
            personalisable: personalisable === true || personalisable === 'true',
            personalisationNote: personalisationNote?.trim(),
            madeToOrder: madeToOrder === true || madeToOrder === 'true',
            isFeatured: isFeatured === true || isFeatured === 'true',
            processingDays: processingDays !== undefined && processingDays !== null && processingDays !== '' ? Number(processingDays) : undefined,
            shippingFee: shippingFee !== undefined && shippingFee !== null && shippingFee !== '' ? Number(shippingFee) : undefined,
            deliveryDays: deliveryDays !== undefined && deliveryDays !== null && deliveryDays !== '' ? Number(deliveryDays) : undefined,
            seller: user.id,
            admin: user.id
        }

        const product = new productModel(productData)
        await product.validate()
        for (const file of files) {
            const uploaded = await uploadFile(file.buffer)
            if (!uploaded?.url || !uploaded?.fileId) {
                throw new Error('Image storage did not return a URL and file ID')
            }
            uploadedFiles.push(uploaded)
        }
        const uploadedUrls = uploadedFiles.map(file => file.url)
        const finalImages = [...uploadedUrls, ...imageArray.filter(img => img && !uploadedUrls.includes(img))]
        product.images = finalImages
        product.image = finalImages[0]
        product.imageKitFileIds = uploadedFiles.map(file => file.fileId)
        product.imageKitFileId = product.imageKitFileIds[0]
        await product.save()
        res.status(201).json({ message: 'Product created successfully.', product })

    } catch (error) {
        console.error(error)
        const fileIds = uploadedFiles.map(file => file.fileId).filter(Boolean)
        if (fileIds.length > 0) {
            try {
                await removeUploadedFiles(fileIds)
            } catch (cleanupError) {
                console.error('Could not clean up uploaded product images:', cleanupError)
            }
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Product with this slug already exists' })
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: error.message || 'Could not create product' })
    }
}

export async function getProducts(req, res) {
    try {
        const { category, q, tags, tag, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query

        const filter = { status: 'active' }
        if (category) filter.category = category
        const tagFilter = tags || tag
        if (tagFilter) {
            const tagArray = Array.isArray(tagFilter) ? tagFilter : String(tagFilter).split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
            if (tagArray.length > 0) {
                filter.tags = { $in: tagArray }
            }
        }
        if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
            const min = Number(minPrice)
            if (!Number.isNaN(min)) filter.price = { ...filter.price, $gte: min }
        }
        if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
            const max = Number(maxPrice)
            if (!Number.isNaN(max)) filter.price = { ...filter.price, $lte: max }
        }
        if (q) {
            filter.$text = { $search: q }
        }

        const skip = (Number(page) - 1) * Number(limit)
        const sortOption = sort === 'price-up' ? { price: 1 }
            : sort === 'price-down' ? { price: -1 }
            : sort === 'popular' ? { soldCount: -1, ratingAverage: -1 }
            : { createdAt: -1 }

        const [products, total] = await Promise.all([
            productModel.find(filter)
                .populate('admin', 'username')
                .populate('seller', 'username')
                .sort(sortOption)
                .skip(skip)
                .limit(Number(limit)),
            productModel.countDocuments(filter)
        ])

        res.status(200).json({
            message: 'products fetched!',
            products,
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit))
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getAdminProducts(req, res) {
    try {
        const products = await productModel.find()
            .populate('admin', 'username')
            .populate('seller', 'username')
            .sort({ createdAt: -1 })
        res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function getProductById(req, res) {
    try {
        const product = await productModel.findOne({ _id: req.params.id }).populate('admin', 'username').populate('seller', 'username')
        if (!product) {
            return res.status(404).json({ message: 'product not found' })
        }
        res.status(200).json({ message: 'product fetched!', product })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export async function updateProduct(req, res) {
    const uploadedFiles = []
    try {
        const files = getUploadedFiles(req)
        if (files.length > 10) {
            return res.status(400).json({ message: 'a product can have at most 10 images' })
        }
        const {
            name,
            productName,
            description,
            desc,
            shortDescription,
            price,
            compareAtPrice,
            category,
            stock,
            status,
            brand,
            tags,
            materials,
            personalisable,
            personalisationNote,
            madeToOrder,
            processingDays,
            shippingFee,
            deliveryDays,
            images,
            imageUrls,
            dimensions,
            weight,
            colors,
            sizes,
            variants,
            isFeatured,
            currency
        } = req.body

        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'product not found' })
        }

        if (name !== undefined) { product.name = name?.trim(); product.productName = product.name; }
        if (productName !== undefined) { product.productName = productName?.trim(); if (!product.name) product.name = product.productName; }
        if (description !== undefined) { product.description = description; product.desc = description; }
        if (desc !== undefined) { product.desc = desc; if (!product.description) product.description = desc; }
        if (shortDescription !== undefined) product.shortDescription = shortDescription?.trim()
        if (!product.name?.trim()) return res.status(400).json({ message: 'product name is required' })
        if (price !== undefined) {
            const priceNum = Number(price)
            if (!Number.isFinite(priceNum) || priceNum < 0) return res.status(400).json({ message: 'negative or not a number' })
            product.price = priceNum
        }
        if (compareAtPrice !== undefined) {
            if (compareAtPrice === null || compareAtPrice === '') product.compareAtPrice = undefined
            else {
                const c = Number(compareAtPrice)
                if (Number.isNaN(c) || c < 0) return res.status(400).json({ message: 'negative or not a number' })
                product.compareAtPrice = c
            }
        }
        if (currency !== undefined) product.currency = currency
        if (category !== undefined) {
            const ctrim = String(category).trim()
            if (!ALLOWED_CATEGORIES.includes(ctrim)) return res.status(400).json({ message: 'category not in the six' })
            product.category = ctrim
        }
        if (stock !== undefined) {
            const s = Number(stock)
            if (Number.isNaN(s) || s < 0) return res.status(400).json({ message: 'stock negative' })
            product.stock = s
        }
        if (status !== undefined) product.status = status
        if (brand !== undefined) product.brand = brand?.trim()
        if (tags !== undefined) product.tags = parseArray(tags)
        if (materials !== undefined) product.materials = parseArray(materials)
        if (dimensions !== undefined) product.dimensions = dimensions?.trim()
        if (weight !== undefined) product.weight = weight?.trim()
        if (colors !== undefined) product.colors = parseArray(colors)
        if (sizes !== undefined) product.sizes = parseArray(sizes)
        if (variants !== undefined) product.variants = parseArray(variants)
        if (personalisable !== undefined) product.personalisable = personalisable === true || personalisable === 'true'
        if (personalisationNote !== undefined) product.personalisationNote = personalisationNote?.trim()
        if (madeToOrder !== undefined) product.madeToOrder = madeToOrder === true || madeToOrder === 'true'
        if (isFeatured !== undefined) product.isFeatured = isFeatured === true || isFeatured === 'true'
        if (processingDays !== undefined) product.processingDays = processingDays === null || processingDays === '' ? undefined : Number(processingDays)
        if (shippingFee !== undefined) product.shippingFee = shippingFee === null || shippingFee === '' ? undefined : Number(shippingFee)
        if (deliveryDays !== undefined) product.deliveryDays = deliveryDays === null || deliveryDays === '' ? undefined : Number(deliveryDays)
        if (imageUrls !== undefined || images !== undefined) product.images = parseArray(imageUrls ?? images)

        await product.validate()
        for (const file of files) {
            const uploaded = await uploadFile(file.buffer)
            if (!uploaded?.url || !uploaded?.fileId) {
                throw new Error('Image storage did not return a URL and file ID')
            }
            uploadedFiles.push(uploaded)
        }
        const uploadedUrls = uploadedFiles.map(file => file.url)
        product.images = [...uploadedUrls, ...(product.images || []).filter(image => image && !uploadedUrls.includes(image))]
        if (uploadedFiles.length > 0) {
            product.imageKitFileIds = [...new Set([...(product.imageKitFileIds || []), ...uploadedFiles.map(file => file.fileId)])]
            product.imageKitFileId = product.imageKitFileId || uploadedFiles[0].fileId
        }
        product.image = product.images[0]

        await product.save()
        res.status(200).json({ message: 'Product updated successfully.', product })
    } catch (error) {
        console.error(error)
        const fileIds = uploadedFiles.map(file => file.fileId).filter(Boolean)
        if (fileIds.length > 0) {
            try {
                await removeUploadedFiles(fileIds)
            } catch (cleanupError) {
                console.error('Could not clean up uploaded product images:', cleanupError)
            }
        }
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Product with this slug already exists' })
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message: error.message || 'Could not update product' })
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = await productModel.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'product not found' })
        }

        const fileIds = [...new Set([...(product.imageKitFileIds || []), product.imageKitFileId].filter(Boolean))]
        await removeUploadedFiles(fileIds)
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Product deleted successfully.' })
    } catch (error) {
        res.status(500).json({ message: `Could not delete product and its images: ${error.message}` })
    }
}
