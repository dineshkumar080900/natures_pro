const express = require('express');
const ProductType = require('./producttypemogoes'); // Ensure the correct model is imported

const router = express.Router();

// Add a new product type
router.post('/addProductType', async (req, res) => {
  const { producttype } = req.body;

  // Validate producttype is present
  if (!producttype || typeof producttype !== 'string' || producttype.trim() === '') {
    return res.status(400).json({ error: 'Product type is required and must be a non-empty string' });
  }

  try {
    const newProductType = new ProductType({ producttype });
    await newProductType.save();
    res.status(201).json({
      message: 'Product type added successfully',
      productType: newProductType
    });
  } catch (error) {
    console.error('Error adding product type:', error);
    res.status(500).json({ error: 'Internal server error while adding product type' });
  }
});




router.get('/getProductTypes', async (req, res) => {
    const productTypes = await ProductType.find();
    res.json(productTypes)

    // try {
    //   // Fetch all product types from the database
   
  
    //   // Check if no product types are found
    //   if (!productTypes.length) {
    //     return res.status(404).json({ error: 'No product types found' });
    //   }
  
    //   // Respond with the list of product types
    //   res.status(200).json({
    //     message: 'Product types fetched successfully',
    //     productTypes: productTypes
    //   });
    // } catch (error) {
    //   console.error('Error fetching product types:', error);
    //   res.status(500).json({ error: 'Internal server error while fetching product types' });
    // }
  });
module.exports = router;