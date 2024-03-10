var express = require("express");
var medicineRoutes = express.Router();
const verifyToken = require("./token");
const medicineModel = require("../models/Medicines"); //Import model
const mongoose = require("mongoose"); //Import mongo

// api to add user
medicineRoutes.route("/add").post(verifyToken, function (req, res) {
  let medicine = new medicineModel(req.body);
  medicine
    .save()
    .then((user) => {
      res.status(200).json({
        status: 200,
        mssg: "medicine added successfully",
        medicineDetails: medicine,
      });
    })
    .catch((err) => {
      res
        .status(409)
        .send({ status: 500, mssg: "unable to save to database" });
    });
});

// api to get users
medicineRoutes.route("/").get(verifyToken, function (req, res) {
  medicineModel.find(function (err, medicines) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, medicines: medicines });
    }
  });
});

// get recent
// Assuming you have defined 'medicineRoutes' and 'medicineModel' elsewhere in your code.

// Define a route for getting recent medicines
medicineRoutes.route("/getRecent").get(verifyToken, function (req, res) {
  // Use the 'find' method to retrieve medicines
  medicineModel
    .find()
    // Use 'sort' to specify sorting criteria, e.g., sort by 'createdAt' in descending order
    .sort({ createdAt: -1 })
    // Use 'limit' to restrict the number of results to 5
    .limit(5)
    // Execute the query and handle the results
    .exec(function (err, medicines) {
      if (err) {
        // If there's an error, send a 500 status response
        res.status(500).send({ status: 500, mssg: "Something went wrong" });
      } else {
        // If successful, send a 200 status response with the retrieved medicines
        res.status(200).json({ status: 200, medicines: medicines });
      }
    });
});



// api to edit user
medicineRoutes.route("/edit/:id").get(verifyToken, function (req, res) {
  let id = req.params.id;
  medicineModel.findById(id, function (err, medicine) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, medicine: medicine });
    }
  });
});

// api to update route
medicineRoutes.route("/update/:id").post(verifyToken, function (req, res) {
  medicineModel.findById(req.params.id, function (err, medicine) {
    if (!medicine) {
      res.status(400).send({ status: 500, mssg: "Unable to find data" });
    } else {
      medicine.brand = req.body.brand;
      medicine.remarks = req.body.remarks;
      medicine.name = req.body.name;
      medicine.batch = req.body.batch;
      medicine.mrp = req.body.mrp;
      medicine.expiry = req.body.expiry;

      medicine.save().then((business) => {
        res.status(200).json({ status: 200, mssg: "Update complete" });
      });
    }
  });
});

// api for delete
medicineRoutes.route("/delete/:id").get(verifyToken, function (req, res) {
  medicineModel.findByIdAndRemove({ _id: req.params.id }, function (err) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, mssg: "Delete successfully" });
    }
  });
});

// Assuming you have 'medicineRoutes' and 'Medicines' defined elsewhere in your code.

// Assuming you have 'medicineRoutes' and 'Medicines' defined elsewhere in your code.

// API endpoint to find a record based on brandName parameter
medicineRoutes.route("/findByBrand").get(verifyToken, function (req, res) {
  const brandName = req.query.brandName;

  // Use Mongoose to find a record based on brandName
  medicineModel.find(
    { brand: new RegExp(brandName, "i") },
    { brand: 1, _id: 0 },
    function (err, medicines) {
      if (err) {
        res.status(500).send({ status: 500, mssg: "Internal Server Error" });
      } else {
        // Extract brand names from the result
        const brandNames = medicines.map((medicine) => medicine.brand);
        res.status(200).json({ status: 200, brandNames: brandNames });
      }
    }
  );
});

// Add a new route to get all brand names
medicineRoutes.route("/getAllBrandNames").get(verifyToken, function (req, res) {
  // Use Mongoose to find all distinct brand names
  medicineModel.distinct("brand", function (err, brandNames) {
    if (err) {
      res.status(500).send({ status: 500, mssg: "Internal Server Error" });
    } else {
      res.status(200).json({ status: 200, brandNames: brandNames });
    }
  });
});




medicineRoutes.delete("/delete", (req, res) => {
  // Delete all records in the collection
  medicineModel.deleteMany({}, (error) => {
    if (error) {
      console.error("Error deleting records:", error);
      res.status(500).json({ error: "Error deleting records" });
    } else {
      console.log("Records deleted successfully");
      res.status(200).json({ message: "Records deleted successfully" });
    }
  });
});

module.exports = medicineRoutes;