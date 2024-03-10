var express = require("express");
var billRouter = express.Router();
const verifyToken = require("./token");

const billModel = require("../models/Bill"); //Import model
const medicineModel = require("../models/Medicines"); //Import model
const fs = require("fs");
const mongoose = require("mongoose"); //Import mongo
const nodemailer = require("nodemailer"); //Import mongo

// api to add user
billRouter.route("/add").post(verifyToken, function (req, res) {
  let bill = new billModel(req.body);
  bill
    .save()
    .then(async (user) => {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.email",
        port: 587,
        auth: {
          user: "mohinchughynr@gmail.com",
          pass: "kjxg oamj wszq mdvp",
        },
      });

      const getMedicineName = async (medicineId) => {
        try {
          //fetch medicine name by id
          const medicine = await medicineModel.findById(medicineId);
          console.log(medicine);
          return medicine ? medicine.name : "Unknown Medicine";
        } catch (error) {
          console.log(error);
        }
      };

      const readExternalHtmlFile = async () => {
        try {
          let externalHtml = fs.readFileSync(
            "html_templates/bill-template.html",
            "utf-8"
          );
          let medTableRows = "";
          const medicineRows = await Promise.all(
            req.body.medicineDetails.map(async (element) => {
              const medicineName = await getMedicineName(element.medicineId);
              return `<tr><td>${medicineName}</td><td>${element.quantity}</td><td>${element.price}</td></tr>`;
            })
          );

          medTableRows = medicineRows.join(""); // Concatenate the rows
          externalHtml = externalHtml
            .replace(/{{customerName}}/g, req.body.custName.toUpperCase())
            .replace(/{{grandTotal}}/g, req.body.totalAmount)
            .replace(/{{gst}}/g, req.body.gst)
            .replace(/{{discount}}/g, req.body.discount || 0)
            .replace(/{{subTotal}}/g, req.body.subTotal || 0)
            .replace(/{{medicinetable}}/g, medTableRows);
          return externalHtml;
        } catch (error) {
          console.error("Error reading external HTML file:", error);
          return "";
        }
      };

      const mailOptions = {
        from: {
          name: "InvoiceBlits",
          address: "mohinchughynr@gmail.com",
        },
        to: [`${req.body.custEmail}`],
        subject: "Bill Generated",
        html: "",
      };

      mailOptions.html += await readExternalHtmlFile();

      const sendMail = async (transporter, mailOptions) => {
        try {
          await transporter.sendMail(mailOptions);
          console.log("Mail Sent");
        } catch (error) {
          console.log(error);
        }
      };

      sendMail(transporter, mailOptions);

      res.status(200).json({
        status: 200,
        mssg: "bill added successfully",
        billDetails: bill,
      });
    })
    .catch((err) => {
      res.status(409).send({ status: 500, mssg: "unable to save to database" });
    });
});

// api to get users
billRouter.route("/").get(verifyToken, function (req, res) {
  billModel.find(function (err, bills) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, bills: bills });
    }
  });
});

// get recent
// Assuming you have defined 'billRouter' and 'billModel' elsewhere in your code.

// Define a route for getting recent medicines
billRouter.route("/getRecent").get(verifyToken, function (req, res) {
  // Use the 'find' method to retrieve medicines
  billModel
    .find()
    // Use 'sort' to specify sorting criteria, e.g., sort by 'createdAt' in descending order
    .sort({ createdAt: -1 })
    // Use 'limit' to restrict the number of results to 5
    .limit(5)
    // Execute the query and handle the results
    .exec(function (err, bills) {
      if (err) {
        // If there's an error, send a 500 status response
        res.status(500).send({ status: 500, mssg: "Something went wrong" });
      } else {
        // If successful, send a 200 status response with the retrieved medicines
        res.status(200).json({ status: 200, bills: bills });
      }
    });
});

// api to edit user
billRouter.route("/edit/:id").get(verifyToken, function (req, res) {
  let id = req.params.id;
  billModel.findById(id, function (err, bill) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, bill: bill });
    }
  });
});

// api to update route
billRouter.route("/update/:id").post(verifyToken, function (req, res) {
  billModel.findById(req.params.id, function (err, bill) {
    if (!bill) {
      res.status(400).send({ status: 500, mssg: "Unable to find data" });
    } else {
      console.log(req.body.medicineDetails, "log test");

      // Clear existing medicineDetails array
      bill.medicineDetails = [];

      // Iterate over the payload and add each element to the medicineDetails array
      req.body.medicineDetails.forEach((element) => {
        bill.medicineDetails.push({
          medicineId: element.medicineId,
          quantity: element.quantity,
          price: element.price,
        });
      });

      // Update other fields
      bill.custName = req.body.custName;
      bill.custEmail = req.body.custEmail;
      bill.docName = req.body.docName;
      bill.custAddress = req.body.custAddress;
      bill.medicineCount = req.body.medicineCount;
      bill.totalAmount = req.body.totalAmount;
      bill.gst = req.body.gst;
      bill.discount = req.body.discount;

      // Save the updated document
      bill.save().then((updatedBill) => {
        console.log("Update Successful:", updatedBill);
        res.status(200).json({ status: 200, mssg: "Update complete" });
      });
    }
  });
});

// api for delete
billRouter.route("/delete/:id").get(verifyToken, function (req, res) {
  billModel.findByIdAndRemove({ _id: req.params.id }, function (err) {
    if (err) {
      res.status(400).send({ status: 500, mssg: "Something went wrong" });
    } else {
      res.status(200).json({ status: 200, mssg: "Delete successfully" });
    }
  });
});

// Assuming you have 'billRouter' and 'Medicines' defined elsewhere in your code.

// Assuming you have 'billRouter' and 'Medicines' defined elsewhere in your code.

// API endpoint to find a record based on brandName parameter
billRouter.route("/findByName").get(verifyToken, function (req, res) {
  const custName = req.query.name;

  // Use Mongoose to find a record based on brandName
  billModel.find(
    { custName: new RegExp(custName, "i") },
    { custName: 1, _id: 0 },
    function (err, bills) {
      if (err) {
        res.status(500).send({ status: 500, mssg: "Internal Server Error" });
      } else {
        // Extract brand names from the result
        const getBills = bills.map((bill) => bill.custName);
        res.status(200).json({ status: 200, bills: getBills });
      }
    }
  );
});

// Add a new route to get all brand names
billRouter.route("/getAllBrandNames").get(verifyToken, function (req, res) {
  // Use Mongoose to find all distinct brand names
  billModel.distinct("brand", function (err, brandNames) {
    if (err) {
      res.status(500).send({ status: 500, mssg: "Internal Server Error" });
    } else {
      res.status(200).json({ status: 200, brandNames: brandNames });
    }
  });
});

billRouter.delete("/delete", (req, res) => {
  // Delete all records in the collection
  billModel.deleteMany({}, (error) => {
    if (error) {
      console.error("Error deleting records:", error);
      res.status(500).json({ error: "Error deleting records" });
    } else {
      console.log("Records deleted successfully");
      res.status(200).json({ message: "Records deleted successfully" });
    }
  });
});

module.exports = billRouter;
