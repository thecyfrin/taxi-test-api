// vehicle.js (Plain JS Model)
class VehicleModel {
	constructor(
		id,
		isActive,
		carName,
		carModel,
		vinNum,
		vehicleTier,
		carLicense
	) {
		this.id = id;
		this.isActive = isActive;
		this.carName = carName;
		this.carModel = carModel;
		this.vinNum = vinNum;
		this.vehicleTier = vehicleTier;
		this.carLicense = carLicense;
	}
}

module.exports = VehicleModel;
