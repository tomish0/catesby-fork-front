const Joi = require("@hapi/joi");

export const signUpSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string()
    .pattern(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "email"
    )
    .required(),
});

export const personalDetailsSchema = Joi.object({
  name: Joi.string().min(2).max(70).required(),
  email: Joi.string()
    .pattern(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "email"
    )
    .required(),
  phoneNumber: Joi.string().min(7).max(15),
});

export const addressSchema = Joi.object({
  addressLine1: Joi.string().min(1).required(),
  cityTown: Joi.string().min(2).required(),
  postcode: Joi.string().min(3).required(),
  country: Joi.string().min(2).required(),
});
