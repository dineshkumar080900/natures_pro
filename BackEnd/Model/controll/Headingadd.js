const express = require('express');
const mongoose = require('mongoose');

// Initialize Router
const router = express.Router();

// Define Schema for Headingcontent
const HeadingcontentSchema = new mongoose.Schema({
    titleheading: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate heading titles
    },
    edingcontent: {
        type: String,
        required: true,
    },
});

// Create the Headingcontent model
const Headingcontent = mongoose.model('Headingcontent', HeadingcontentSchema);

router.post('/addeding', async (req, res) => {
    // Destructure the required fields from the request body
    const { titleheading, edingcontent } = req.body;

    // Input validation: Ensure both titleheading and edingcontent are provided
    if (!titleheading || !edingcontent) {
        return res.status(400).json({ error: 'Both titleheading and edingcontent are required.' });
    }

    try {
        // Create a new heading content document with sanitized input (trimmed values)
        const newHeading = new Headingcontent({
            titleheading: titleheading.trim(), // Trim any extra spaces around the title
            edingcontent: edingcontent.trim(),  // Trim extra spaces around the content
        });

        // Save the new heading content document to the database
        const savedHeading = await newHeading.save();

        // Respond with the success message and the saved heading data
        res.status(201).json({
            message: 'Heading content added successfully.',
            data: savedHeading, // Return the saved heading document
        });

    } catch (err) {
        // Log the error for debugging and respond with a generic 500 error if something goes wrong
        console.error('Error adding heading content:', err);
        res.status(500).json({ error: 'An error occurred while adding the heading content.' });
    }
});

// Retrieve all heading content
router.get('/edingcode', async (req, res) => {
    try {
        const getHeadings = await Headingcontent.find();
        res.json(getHeadings);
    } catch (err) {
        console.error('Error retrieving heading content:', err);
        res.status(500).json({ error: 'Failed to retrieve heading content' });
    }
});

// Delete a heading content by titleheading
router.delete('/headingdelete/:headingid', async (req, res) => {
    const { headingid } = req.params;

    try {
        // Attempt to delete the document using its unique _id field
        const result = await Headingcontent.deleteOne({ _id: headingid });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Heading content not found' });
        }

        res.status(200).json({ message: 'Heading content deleted successfully' });
    } catch (err) {
        console.error('Error deleting heading content:', err);
        res.status(500).json({ error: 'Failed to delete heading content' });
    }
});
router.put('/edingcode/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract the ID from the request parameters
        const updatedData = req.body;  // Get the data to update from the request body

        // Find the heading by ID and update it
        const updatedHeading = await Headingcontent.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedHeading) {
            return res.status(404).json({ error: 'Heading content not found' });
        }

        // Return the updated heading content
        res.json(updatedHeading);
    } catch (err) {
        console.error('Error updating heading content:', err);
        res.status(500).json({ error: 'Failed to update heading content' });
    }
});








// Export the router to use in the main app
module.exports = router;