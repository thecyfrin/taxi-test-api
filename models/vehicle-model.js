// vehicle.js (Plain JS Model)
class VehicleModel {
	constructor(id, carName, carModel, vinNum, vehicleTier, carLicense) {
		this.id = id;
		this.carName = carName;
		this.carModel = carModel;
		this.vinNum = vinNum;
		this.vehicleTier = vehicleTier;
		this.carLicense = carLicense;
	}
}

module.exports = VehicleModel;
