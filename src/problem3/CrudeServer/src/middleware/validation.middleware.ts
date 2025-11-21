import { response } from "../helper/helper";

import Joi from "joi";

export const validateBody = (schema: Joi.Schema) => {
  return async (req: any, res: any, next: any) => {

    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return response.validation(
        res,
        400,
        await Promise.all(
          error.details.map(async (detail: any) => ({
            [detail.path[0]]: detail.message,
          }))
        )
      );
    } else {
      next();
    }
  };
};

export const validateQuery = (schema: Joi.Schema) => {
  return async (req: any, res: any, next: any) => {

    const { error } = schema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      return response.validation(
        res,
        400,
        await Promise.all(
          error.details.map(async (detail: any) => ({
            [detail.path[0]]: detail.message,
          }))
        )
      );
    } else {
      next();
    }
  };
};