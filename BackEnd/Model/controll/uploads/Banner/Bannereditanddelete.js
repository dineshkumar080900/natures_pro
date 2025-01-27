const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DefaultTable = require('./Bannermongoed');

// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/images', // Specify upload directory
    filename: (req, file, cb) => {
        // Create a unique filename using the current timestamp and the file's extension
        const uniqueSuffix = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({ storage });

// POST route to handle banner addition
router.post('/addbanner', upload.single('myImage'), async (req, res) => {
    try {
        const errors = [];
        if (!req.body.name) errors.push('Name is required.');
        if (!req.body.option) errors.push('Option is required.');
        if (!req.file) errors.push('Image is required.');

        if (errors.length > 0) {
            return res.status(400).json({ error: errors.join(' ') });
        }

        const newBanner = new DefaultTable({
            name: req.body.name,
            option: req.body.option,
            image: req.file ? `/uploads/images/${req.file.filename}` : null,
        });

        await newBanner.save();

        res.status(201).json({
            success: true,
            banner: {
                name: req.body.name,
                option: req.body.option,
                image: req.file ? `/uploads/images/${req.file.filename}` : null,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the banner.' });
    }
});
// GET route to fetch all banners
router.get('/getbanners', async (req, res) => {
    try {
        const banners = await DefaultTable.find(); // Fetch all banners from the database
        res.status(200).json({ success: true, banners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching banners.' });
    }
});

router.delete('/banners/:id', async (req, res) => {
    try {
        const banner = await DefaultTable.findByIdAndDelete(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found.' });
        }
        res.status(200).json({ success: true, message: 'Banner deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the banner.' });
    }
});
router.put('/banners/:id', upload.single('myImage'), async (req, res) => {
    try {
        const banner = await DefaultTable.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found.' });
        }

        banner.name = req.body.name || banner.name;
        banner.option = req.body.option || banner.option;
        if (req.file) {
            banner.image = `${req.file.filename}`;
        }

        await banner.save();

        res.status(200).json({
            success: true,
            banner: {
                name: banner.name,
                option: banner.option,
                image: banner.image,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the banner.' });
    }
});


module.exports = router;