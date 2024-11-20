const multer = require("multer");
const fs = require("fs");
const path = require("path");
const multerGoogleStorage = require("multer-google-storage");

exports.upload = () => {
	return multer({
		storage: multerGoogleStorage.storageEngine({
			autoRetry: true,
			bucket: "soemwhere-bucket",
			projectId: "storerun-404909",
			keyFilename: "config/keys/storerun-404909-89f677a0013c.json",
		}),

		fileFilter: (req, file, cb) => {
			const validFileTypes = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF/;
			const isValidExt = validFileTypes.test(
				path.extname(file.originalname).toLowerCase()
			);
			const isValidMime = validFileTypes.test(file.mimetype);

			if (isValidMime && isValidExt) {
				return cb(null, true);
			} else {
				console.log(
					"Error: Image upload failed due to invalid file type or MIME type."
				);
				return cb(new Error("Error: Images Only!"));
			}
		},
	});
};

exports.multi_upload = (folderName) => {
	return multer({
		storage: multer.diskStorage({
			destination: function (req, file, cb) {
				const dirPath = `src/constructing/${folderName}/${req.params.driverID}`;
				fs.mkdirSync(dirPath, { recursive: true }); // Ensure directory exists
				cb(null, dirPath); // Save the file in the constructed directory
			},
			filename: (req, file, cb) => {
				cb(
					null,
					`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
				);
			},
		}),
		fileFilter: (req, file, cb) => {
			const validFileTypes = /jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF/;
			const isValidExt = validFileTypes.test(
				path.extname(file.originalname).toLowerCase()
			);
			const isValidMime = validFileTypes.test(file.mimetype);

			if (isValidMime && isValidExt) {
				return cb(null, true);
			} else {
				console.log(
					"Error: Image upload failed due to invalid file type or MIME type."
				);
				return cb(new Error("Error: Images Only!"));
			}
		},
	});
};
