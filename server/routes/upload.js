const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter for images, PDFs, and CSVs
const fileFilter = (req, file, cb) => {
  // Allow common CSV mimetypes (text/csv, application/vnd.ms-excel, etc.)
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/x-csv', 'application/x-csv', 'text/comma-separated-values', 'text/x-comma-separated-values'];
  
  if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Only JPEG, PNG, PDF, and CSV are allowed.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

/**
 * @route   POST /api/upload/report
 * @desc    Upload medical report and extract data via AI Engine
 * @access  Private
 */
router.post('/report', protect, upload.single('report'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }

  const filePath = req.file.path;

  try {
    // 1. Prepare form data for Python AI Engine
    const formData = new FormData();
    formData.append('report', fs.createReadStream(filePath));

    // 2. Send to Python AI Engine
    const pythonResponse = await axios.post(
      `${process.env.PYTHON_API}/upload-report`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    // 3. Cleanup: Delete local file
    fs.unlinkSync(filePath);

    // 4. Return extracted data
    res.json(pythonResponse.data);
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      message: 'Failed to process report via AI Engine',
      error: error.response ? error.response.data : error.message 
    });
  }
});

module.exports = router;
