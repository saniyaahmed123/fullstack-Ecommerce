import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { readFile } from 'node:fs/promises'
import productModel from './src/models/product.model.js'
import userModel from './src/models/user.model.js'

dotenv.config()

const catalog = [
    {
        slug: 'crochet-bunny-plush-seed',
        name: 'Crochet Bunny Plush',
        description: 'A soft, huggable bunny crocheted by hand from premium cotton yarn with carefully embroidered features.',
        shortDescription: 'Hand-crocheted cotton bunny, made in small batches.',
        price: 4200,
        compareAtPrice: 5200,
        category: 'crochet',
        tags: ['crochet', 'handmade', 'gift'],
        materials: ['Cotton yarn', 'Polyester filling'],
        dimensions: 'Approximately 22 cm tall',
        weight: 'Approximately 250 g',
        colors: ['Cream', 'Sage', 'Blush'],
        sizes: ['Small (18 cm)', 'Medium (22 cm)', 'Large (30 cm)'],
        variants: [
            { name: 'Size', values: ['Small (18 cm)', 'Medium (22 cm)', 'Large (30 cm)'] },
            { name: 'Colour', values: ['Cream', 'Sage', 'Blush'] }
        ],
        stock: 8,
        personalisable: false,
        madeToOrder: true,
        processingDays: 5,
        shippingFee: 0,
        deliveryDays: 7,
        brand: 'Handy Makers',
        imageFiles: [
            { asset: 'dealimages/1.png', fileName: 'crochet-bunny-main.png' },
            { asset: 'crochet/1.png', fileName: 'crochet-bunny-detail.png' },
            { asset: 'heroeditorial2.png', fileName: 'crochet-bunny-lifestyle.png' }
        ]
    },
    {
        slug: 'handmade-ceramic-cat-mug-seed',
        name: 'Handmade Ceramic Cat Mug',
        description: 'A wheel-thrown stoneware mug with a hand-painted cat face and a generous handle. Each mug is glazed by hand.',
        shortDescription: 'Wheel-thrown stoneware mug with a hand-painted cat face.',
        price: 3500,
        compareAtPrice: 4200,
        category: 'ceramics',
        tags: ['ceramics', 'handmade', 'home'],
        materials: ['Stoneware clay', 'Food-safe glaze'],
        dimensions: 'Approximately 350 ml capacity',
        weight: 'Approximately 400 g',
        colors: ['Cream', 'Speckled oat', 'Sage'],
        sizes: ['350 ml', '450 ml'],
        variants: [
            { name: 'Glaze', values: ['Cream', 'Speckled oat', 'Sage'] },
            { name: 'Size', values: ['350 ml', '450 ml'] }
        ],
        stock: 10,
        personalisable: false,
        madeToOrder: true,
        processingDays: 5,
        shippingFee: 0,
        deliveryDays: 7,
        brand: 'Handy Makers',
        imageFiles: [
            { asset: 'heroeditorial.png', fileName: 'ceramic-cat-mug-main.png' },
            { asset: 'claycraft/1.png', fileName: 'ceramic-cat-mug-detail.png' },
            { asset: 'decorandwall/1.png', fileName: 'ceramic-cat-mug-lifestyle.png' }
        ]
    },
    {
        slug: 'heart-locket-photo-bracelet-seed',
        name: 'Heart Locket Photo Bracelet',
        description: 'A delicate gold-tone bracelet with a heart locket that opens to hold two tiny photographs.',
        shortDescription: 'A keepsake bracelet with a tiny photo locket.',
        price: 5500,
        compareAtPrice: 6500,
        category: 'jewellery',
        tags: ['jewellery', 'handmade', 'personalised', 'gift'],
        materials: ['Stainless steel', 'Glass'],
        dimensions: 'Adjustable 16-19 cm chain; heart locket is 1.6 cm',
        weight: 'Approximately 20 g',
        colors: ['Gold tone', 'Silver tone'],
        sizes: ['16 cm', '18 cm', '20 cm'],
        variants: [
            { name: 'Chain length', values: ['16 cm', '18 cm', '20 cm'] },
            { name: 'Metal', values: ['Gold tone', 'Silver tone'] }
        ],
        stock: 10,
        personalisable: true,
        personalisationNote: 'Choose two small photos to place inside the locket.',
        madeToOrder: true,
        processingDays: 4,
        shippingFee: 0,
        deliveryDays: 7,
        brand: 'Handy Makers',
        imageFiles: [
            { asset: 'dealimages/2.png', fileName: 'heart-locket-bracelet-main.png' },
            { asset: 'jwellery/1.png', fileName: 'heart-locket-bracelet-detail.png' },
            { asset: 'wearable/1.png', fileName: 'heart-locket-bracelet-lifestyle.png' }
        ]
    }
]

async function uploadProductImages(imageFiles, uploadFile, deleteFile) {
    const uploaded = []
    try {
        for (const image of imageFiles) {
            const file = await readFile(new URL(`../frontend/src/assets/${image.asset}`, import.meta.url))
            const result = await uploadFile(file, image.fileName)
            if (!result?.url || !result?.fileId) {
                throw new Error(`Image storage did not return a URL and file ID for ${image.fileName}`)
            }
            uploaded.push(result)
        }
        return uploaded
    } catch (error) {
        for (const image of uploaded) {
            try {
                await deleteFile(image.fileId)
            } catch (cleanupError) {
                console.error(`Could not clean up uploaded image ${image.fileId}:`, cleanupError)
            }
        }
        throw error
    }
}

async function run() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is required to seed the catalog')
    }
    if (!process.env.IMAGEKIT_PRIVATE_KEY) {
        throw new Error('IMAGEKIT_PRIVATE_KEY is required to upload catalog images')
    }

    await mongoose.connect(process.env.MONGO_URI)

    const admin = await userModel.findOne({ email: 'ali@gmail.com' }).select('_id role')
    if (!admin || admin.role !== 'admin') {
        throw new Error('ali@gmail.com must exist as an admin before seeding the catalog')
    }

    const { default: uploadFile, deleteFile } = await import('./src/services/storage.service.js')
    let inserted = 0
    let skipped = 0
    for (const productData of catalog) {
        if (await productModel.exists({ slug: productData.slug })) {
            skipped++
            continue
        }

        const { imageFiles, ...productFields } = productData
        const uploaded = await uploadProductImages(imageFiles, uploadFile, deleteFile)
        const images = uploaded.map(image => image.url)
        const product = new productModel({
            ...productFields,
            productName: productFields.name,
            desc: productFields.description,
            currency: 'PKR',
            images,
            image: images[0],
            imageKitFileIds: uploaded.map(image => image.fileId),
            imageKitFileId: uploaded[0].fileId,
            status: 'active',
            isFeatured: true,
            admin: admin._id,
            seller: admin._id
        })

        try {
            await product.save()
            inserted++
        } catch (error) {
            for (const image of uploaded) {
                try {
                    await deleteFile(image.fileId)
                } catch (cleanupError) {
                    console.error(`Could not clean up uploaded image ${image.fileId}:`, cleanupError)
                }
            }
            throw error
        }
    }

    console.log(`Catalog seed complete: ${inserted} products added, ${skipped} existing products skipped.`)
}

run()
    .catch(error => {
        console.error('Catalog seeding error:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await mongoose.disconnect()
    })
