const Joi = require('joi')

const validateRental = (rental) => {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    })
    const result = schema.validate(rental)

    return result
}

module.exports = validateRental;