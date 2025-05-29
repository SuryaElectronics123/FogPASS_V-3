const express = require('express');
const XLSX = require('xlsx');
const fs = require('fs');
const router = express.Router();

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

module.exports = router;