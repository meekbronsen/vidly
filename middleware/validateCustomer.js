const Joi = require('joi')

const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(3).trim().required(),
        phone: Joi.string().trim().required(),
        isGold: Joi.boolean()
    })
    const result = schema.validate(customer)

    return result
}

module.exports = validateCustomer;