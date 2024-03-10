// const mongoose = require("mongoose");

// const medicineSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   batch: { type: String, required: true },
//   price: { type: Number, required: false },
//   expiryDate: { type: Date, required: false },
// });

// const Medicine = mongoose.model("Medicine", medicineSchema);
// module.exports = Medicine;

const mongoose = require("mongoose");
const medicineSchema = mongoose.Schema;

let User = new medicineSchema(
  {
    brand: {
      type: String,
    },
    name: {
      type: String,
    },
    batch: {
      type: String,
    },
    mrp: {
      type: String,
    },
    remarks: {
      type: String,
    },
    expiry: {
      type: String,
    },
  },
  {
    collection: "medicines",
    timestamps: true,
  }
);

module.exports = mongoose.model("Medicines", User);