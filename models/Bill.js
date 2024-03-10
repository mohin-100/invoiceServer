const mongoose = require("mongoose");
const billSchema = mongoose.Schema;

let User = new billSchema(
  {
    custName: {
      type: String,
    },
    custEmail: {
      type: String,
    },
    docName: {
      type: String,
    },
    custAddress: {
      type: String,
    },
    medicineDetails: [
      {
        medicineId: {
          type: String,
        },
        quantity: {
          type: String,
        },
        price: {
          type: String,
        },
      },
    ],
    medicineCount: {
      type: String,
    },
    subTotal: {
      type: String,
    },
    totalAmount: {
      type: String,
    },
    gst: {
      type: String,
    },
    discount: {
      type: String,
    },
  },
  {
    collection: "bills",
    timestamps: true,
  }
);

module.exports = mongoose.model("Bills", User);
