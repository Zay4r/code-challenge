import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import { helper, response } from "../../helper/helper";

const bcrypt = require("bcrypt");

import { ResponseCode } from "../../enums/response";
import { findUserByEmail } from "../user/user.service";


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (!existingUser) return response.fail(res, 404, { email: 'Not found', });

    //check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return response.fail(res, 400, {
        password: 'Incorrect',
      });
    }

    //generate token
    const payload = helper.generateToken({
      id: Number(existingUser.id),
      email: existingUser.email,
    });

    return response.success(res, 200, ResponseCode.SUCCESS, {
      id: existingUser.id,
      email: existingUser.email,
      token: payload,
    });
  } catch (error) {
    return response.internal(
      res,
      500,
      ResponseCode.INTERNAL_SERVER_ERROR,
      error as unknown as string
    );
  }
};
