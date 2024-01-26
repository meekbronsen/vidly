const express = require("express");
const validateCustomer = require("../middleware/validateCustomer");
const { Customer } = require("../models/customer");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  return await Customer.find().then((result) => res.send(result));
});

router.post("/", async (req, res) => {
  const { value, error } = validateCustomer(req.body);

  const customer = new Customer({
    name: value.name,
    phone: value.phone,
    isGold: value.isGold,
  });

  if (error) return res.status(400).send(error.details[0].message);

  return await customer
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.put("/:id", auth, async (req, res) => {
  const { value, error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  return await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: value.name,
        phone: value.phone,
        isGold: value.isGold,
      },
    },
    { new: true }
  )
    .then((result) => res.send(result))
    .catch((err) => {
      res.status(500).send("Internal Server error");
      console.log(err);
    });
});

// DELETE
router.delete("/", async (req, res) => {
  const result = await Customer.deleteMany({}, {new: true})
  return res.send(result)
  
});

router.delete("/:id", auth, async (req, res) => {
  const result = await Customer.findByIdAndRemove(req.params.id, { new: true })
  return res.send(result)

});

module.exports = router;
