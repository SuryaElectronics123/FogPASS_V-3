const express = require('express');
const { writeFile, utils, write } = require('xlsx');
const Trips = require('../models/trips');
const User = require('../models/Users');
const Zones = require('../models/zone');
const Divisions = require('../models/division');
const Sections = require('../models/section');
const { where } = require('sequelize');
const TripSignalDetails = require('../models/tripSignalDetails');
const router = express.Router();
// ✅ Create Trip
router.post('/', async (req, res) => {
    try {
        const trip = await Trips.create(req.body);
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trips.findAll();
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Trip By ID
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trips.findByPk(req.params.id);
        trip ? res.json(trip) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Trip
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Trips.update(req.body, { where: { id: req.params.id } });
        updated ? res.json({ message: "Trip updated" }) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Trip
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Trips.destroy({ where: { id: req.params.id } });
        deleted ? res.json({ message: "Trip deleted" }) : res.status(404).json({ error: "Trip not found" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reports', async (req, res) => {
    try {
        const trips = await Trips.findAll({
            include: [{
                model: Zones,
                attributes: ['name']
            },
            {
                model: Divisions,
                attributes: ['name']
            },
            {
                model: Sections,
                attributes: ['name']
            },
            {
                model: User,
                attributes: ['username']
            }]
        }
        );
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/reports/:tripId', async (req, res) => {
    try {
        const details = await tripReport(req);
        res.json({
            ...details[0].toJSON(),
            details: details[1]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/reports/:tripId/export', async (req, res) => {
    try {
        const details = await tripReport(req);

        // Convert JSON to worksheet
        const transformedData = details[1].sort((a, b) => new Date(b.crossTime).getTime() - new Date(a.crossTime).getTime()).map((item, i) => {
            item = item.toJSON();
            nextSignal = details[1][i + 1]?.toJSON();
            return {
                "Time": new Date(item.crossTime).toISOString(),  // Ensures ISO format
                "Signal Name": item.signalName,
                "Speed": item.crossWithSpeed,
                "Latitude": item.lat,
                "Longitude": item.lon,
                "Distance between two signals": distance(item.lat, item.lon, nextSignal?.lat, nextSignal?.lon)
            }
        });
        let tripData = details[0].toJSON();
        const tripSummary = [{
            "Route Name": tripData.routeName,
            "Start Time": new Date(tripData.startTime).toISOString(),
            "End Time": new Date(tripData.endTime).getTime() === new Date(0, 0, 0, 0, 0, 0).getTime() ? '' : new Date(tripData.endTime).toISOString(),
            "Zone Name": tripData.Zone?.name,
            "Division Name": tripData.Division?.name,
            "Section Name": tripData.Section?.name,
            "Status": tripData.status,
            "Total Signals": tripData.totalSignals,
            "Crossed Signals": tripData.crossedSignals,
            "Loco Pilot ID": tripData.User?.username,
            "Device ID": tripData.deviceId
        }];
        const workbook = utils.book_new();
        const sheet1 = utils.json_to_sheet(tripSummary);
        const sheet2 = utils.json_to_sheet(transformedData.sort((a, b) => new Date(b.crossTime).getTime() - new Date(a.crossTime).getTime()));

        utils.book_append_sheet(workbook, sheet1, "Trip Summary");
        utils.book_append_sheet(workbook, sheet2, "Signal Details");
        // Generate Excel file buffer
        const buffer = write(workbook, { type: "buffer", bookType: "xlsx" });

        // Set headers and send file
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=Trip_Report.xlsx");
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


function tripReport(req) {
    return Promise.all([Trips.findOne({
        where: {
            id: req.params.tripId
        },
        include: [{
            model: Zones,
            attributes: ['name']
        },
        {
            model: Divisions,
            attributes: ['name']
        },
        {
            model: Sections,
            attributes: ['name']
        },
        {
            model: User,
            attributes: ['username']
        }]
    }
    ), TripSignalDetails.findAll({ where: { tripId: req.params.tripId } })
    ]);
}

function distance(lat1, lon1, lat2, lon2, unit = 'K') {
    if (!lat1 || !lat2 || !lon1 || !lon2)
        return 0

    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}
module.exports = router;
