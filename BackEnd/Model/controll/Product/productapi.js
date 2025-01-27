const express = require('express');
const multer = require('multer');
const Product = require('./productmongodb'); // Adjust the path to your Product model file
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: './upload/products', // Directory to save uploaded images
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// POST API to add a product
router.post('/addproduct', upload.array('images', 6), async (req, res) => {
    try {
        // Log incoming request body and files for debugging
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);

        const { name, description, totalPrice, option, offerPrice, productDetails, productcount, rating } = req.body;

        // Validate request body
        if (!name || !description || !totalPrice || !offerPrice || !productDetails || !option || !productcount || !rating) {
            return res.status(400).json({
                success: false,
                error: 'All fields (name, description, totalPrice, offerPrice, productDetails, option, productcount, and rating) are required.',
            });
        }

        // Validate that at least one image is uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one image is required.',
            });
        }

        // Map uploaded files to image paths
        const images = req.files.map(file => file.filename);

        // Validate price and count fields to ensure they are numbers
        if (isNaN(totalPrice) || isNaN(offerPrice) || isNaN(productcount) || isNaN(rating)) {
            return res.status(400).json({
                success: false,
                error: 'Total Price, Offer Price, Product Count, and Rating must be valid numbers.',
            });
        }

        // Validate that the ratings are between 0 and 5
        if (rating < 0 || rating > 5) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 0 and 5.',
            });
        }

        // Create a new product instance using the Mongoose model
        const newProduct = new Product({
            name,
            description,
            option,
            productcount: parseInt(productcount),  // Ensure product count is an integer
            totalPrice: parseFloat(totalPrice),  // Convert to float
            offerPrice: parseFloat(offerPrice),  // Convert to float
            productDetails,
            images,
            rating: parseFloat(rating),  // Ensure rating is a float
        });

        // Save the product to MongoDB
        const savedProduct = await newProduct.save();

        // Respond with the saved product
        res.status(201).json({
            success: true,
            product: savedProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while adding the product.',
        });
    }
});






//prodcut getmethod

router.get('/getproduct', async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.status(200).json({ success: true, products }); // Return the correct field `products`
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching products.' });
    }
});





//Get product to id
router.get('/getproduct/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract 'id' from the URL parameters
        const product = await Product.findById(id); // Find product by ID in the database

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ success: true, product }); // Return the found product
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
});

//productdeleteapi
router.delete('/productdeleteapi/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while deleting the product.' });
    }
  });



  //Edit productapi

  router.put('/updateproduct/:id', upload.array('images', 6), async (req, res) => {
    try {
        const { name, description, totalPrice, option, offerPrice, productDetails, rating ,productcount } = req.body;

        // Validate required fields
        if (!name || !description || !totalPrice || !offerPrice || !productDetails || !option || !productcount) {
            return res.status(400).json({
                error: 'All fields (name, description, totalPrice, offerPrice, productDetails, option, productcount) are required.',
            });
        }

        // Find the product by ID
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.totalPrice = parseFloat(totalPrice) || product.totalPrice;
        product.offerPrice = parseFloat(offerPrice) || product.offerPrice;
        product.option = option || product.option;
        product.productDetails = productDetails || product.productDetails;
        product.productcount = parseInt(productcount) || product.productcount;

        // Handle image updates (if new images are uploaded)
        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => `${file.filename}`);
            product.images = images;
        }

        // Save the updated product
        const updatedProduct = await product.save();

        // Respond with the updated product
        res.status(200).json({
            success: true,
            message: 'Product updated successfully.',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating the product.' });
    }
});



module.exports = router;