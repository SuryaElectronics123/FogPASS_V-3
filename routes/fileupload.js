const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const Sections = require('../models/section');

// Configure Multer Storage
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get('/download-template', (req, res) => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Define worksheet data (Default Template)
    const worksheetData = [
        ["order", "station", "code", "name", "lat", "lon", "KMNumber"
        ]
    ];

    // Convert data to worksheet format
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zones");

    // Write the Excel file to a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Send file as response
    res.setHeader('Content-Disposition', 'attachment; filename="default_template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});


// File Upload Route
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const processedData = validateJSONAndConvertDDMtoDD(processExcelBuffer(req.file.buffer));
    if (processedData.isErrored) {
        res.status(400).send({ message: 'The file upload failed due to some errors. Please review and correct them before retrying.', filename: req.file.filename, data: processedData.processedData });
    } else {
        let { name, divisionId } = req.body;
        Sections.create({
            name,
            divisionId,
            signals: processedData.processedData
        }).then(routes => {
            res.status(200).json(routes);
        })
    }
});

function processExcelBuffer(fileBuffer) {
    // Convert buffer into a workbook object
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert sheet data to JSON
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

function validateJSONAndConvertDDMtoDD(data) {
    isErrored = false;
    const processedData = data.map(row => {
        let validationMessage = validateManadatoryConditionRowJson(row);
        if (validationMessage === 'passed') {
            row.lat = ddm_to_dd(row.lat);
            row.lon = ddm_to_dd(row.lon);
        } else {
            isErrored = true;
            row['error'] = validationMessage;
        }
        return row;
    })
    // Your validation logic here
    return { processedData, isErrored };
}

function validateManadatoryConditionRowJson(rowInfo) {
    const requiredFields = ["order", "station", "code", "name", "lat", "lon"];
    const missingFields = requiredFields.filter(field => !rowInfo[field] && rowInfo[field] !== 0);

    return missingFields.length > 0
        ? `Validation failed: Missing fields - ${missingFields.join(', ')}`
        : "passed";
}

function ddm_to_dd(ddm) {
    let degrees = Math.floor(ddm / 100.0);
    let minutes = ddm - degrees * 100.0;
    let decimal_degrees = degrees + minutes / 60.0;
    return decimal_degrees;
}

module.exports = router;