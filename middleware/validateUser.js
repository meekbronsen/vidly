const Joi = require('joi');

const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(200).required().email(),  // use email method to make sure the email is valid
        password: Joi.string().min(5).max(255).required(),
    })
    const result = schema.validate(user);

    return result;
}

module.exports = validateUser;