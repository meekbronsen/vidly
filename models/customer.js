const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 100 },
    phone: { type: String, required: true, maxLength: 50 },
    isGold: { type: Boolean, default: false },
  });
  
const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.customerSchema = customerSchema;