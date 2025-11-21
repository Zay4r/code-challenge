import Joi from "joi";

module.exports = {
  auth: {
    login: Joi.object({
      email: Joi.string()
        .email()
        .messages({
          "string.email": "email_invalid",
        })
        .required()
        .empty("")
        .messages({
          "any.required": "required",
          "string.empty": "required",
        }),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\s]{8,30}$/)
        .messages({
          "string.pattern.base": "password_invalid (Try with one Capitle letter, one small latter, one integer and between 8 to 30 letters)",
        })
        .required()
        .empty("")
        .messages({
          "any.required": "required",
          "string.empty": "required",
        }),
    }),

  },
  product: {
    buy: Joi.object({
      products: Joi.array()
        .items(
          Joi.object({
            product_id: Joi.number().required().messages({
              "number.base": "Product ID must be a number",
              "any.required": "Product ID is required",
            }),
            quantity: Joi.number().integer().min(1).default(1).messages({
              "number.base": "Quantity must be a number",
              "number.integer": "Quantity must be an integer",
              "number.min": "Quantity must be at least 1",
            }),
          })
        )
        .unique((a, b) => a.product_id === b.product_id)
        .required()
        .min(1)
        .messages({
          "array.base": "products must be an array",
          "array.unique": "Product IDs must be unique",
          "array.min": "At least one product is required",
          "any.required": "products is required",
        }),
    }),
    get: Joi.object({
      min_price: Joi.number().optional().min(0).messages({
        "number.base": "Min price must be a number",
        "number.min": "Min price cannot be negative",
      }),
      max_price: Joi.number().optional().min(0).messages({
        "number.base": "Max price must be a number",
        "number.min": "Max price cannot be negative",
      }),
      type: Joi.string().optional().valid("ELECTRONICS", "CLOTHING", "FOOD", "BOOKS", "TOYS", "OTHER").messages({
        "string.base": "Type must be a string",
        "any.only": "Invalid product type",
      }),
      brand_id: Joi.number().optional().integer().positive().messages({
        "number.base": "Brand ID must be a number",
        "number.integer": "Brand ID must be an integer",
        "number.positive": "Brand ID must be positive",
      }),
      search: Joi.string().optional().messages({
        "string.base": "Search term must be a string",
      }),
    }),
    delete: Joi.object({
      product_ids: Joi.array()
        .items(
          Joi.number().messages({
            "number.base": "Product ID must be a number",
          })
        )
        .unique()
        .required()
        .min(1)
        .messages({
          "array.base": "product_ids must be an array",
          "array.unique": "Product IDs must be unique",
          "array.min": "At least one product ID is required",
          "any.required": "product_ids is required",
        }),
    }),
  },
};
