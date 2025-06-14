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

    const dataFromExcel = convertIntoRequiredJSON(processExcelBuffer(req.file.buffer));
    if (dataFromExcel.signals.length === 0 && !dataFromExcel.routeName) {
        return res.status(400).send({ message: 'The file is empty or does not contain valid data.' });
    }
    const processedData = validateJSONAndConvertDDMtoDD(dataFromExcel.signals);
    if (processedData.isErrored) {
        res.status(400).send({ message: 'The file upload failed due to some errors. Please review and correct them before retrying.', filename: req.file.filename, data: processedData.processedData });
    } else {
        let { divisionId } = req.body;
        Sections.create({
            name: dataFromExcel.routeName,
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
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1
    });
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

function convertIntoRequiredJSON(data) {
    let output = {
        routeName: "",
        signals: []
    };
    let order = 1;
    data.forEach((element, i) => {
        if (i == 0) {
            if (element.length > 0 && element[1].length > 0) {
                output['routeName'] = element[1];
            }
            return;
        } else {
            if (!element[2]?.startsWith("KM")) {
                let signal = {
                    order: order++,
                    station: element[1],
                    name: element[2],
                    code: element[2],
                    lat: element[5],
                    lon: element[6]
                };
                output.signals.push(signal);
            } else {
                output.signals[output.signals.length - 1].KMNumber = element[2];
            }
        }
    });
    return output;
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