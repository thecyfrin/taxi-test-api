const RiderModel = require("../../models/rider-model");
const TripModel = require("../../models/trip-model");
const { generateUUID, calculateBaseFare } = require("../utils/utils-class");


module.exports = {
    createTrip: async (req, res) => {
        try {
            const rider = await RiderModel.findOne({riderId: req.body.userId});
            if(!rider) {
                return res.status(401).json({ success : false,  message: 'user-not-found' });
            }

            const id = generateUUID(); 
            const trip = new TripModel();
            trip.isTripActive = true;
            trip.tripId = id;
            trip.userId = req.body.userId;
            trip.totalDuration = req.body.totalDuration;
            trip.totalDistance = req.body.totalDistance;
            trip.pickup.main_text = req.body.pickupLocationText;
            trip.pickup.pickupLat = req.body.pickupLat;
            trip.pickup.pickupLong = req.body.pickupLong;
            trip.destination.main_text = req.body.destinationLocationText;
            trip.destination.destinationLat = req.body.destinationLat;
            trip.destination.destinationLong = req.body.destinationLong;
            trip.baseFare = calculateBaseFare(req.body.totalDuration,req.body.totalDistance);

            const tripObject = {
                isTripActive: trip.isTripActive, 
                tripId: trip.tripId, 
                pickup: trip.pickup,
                destination: trip.destination,
                baseFare: trip.baseFare, 
            }

            const response = await trip.save(); 
            if(response.isModified) {
                return res.status(201).json({ success : true, tripObject });
            } else {
                return res.status(500).json({success : false, message: 'trip-create-failed'});
            }

        } catch (error) {
            return res.status(500).json({ success : false, message: 'trip-create-failed', data: error  });
        }

        

    }
}