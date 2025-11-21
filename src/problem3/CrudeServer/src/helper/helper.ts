require("dotenv").config();
const crypto = require("crypto");
import jwt from "jsonwebtoken";


const SECRET_KEY =
  process.env.JWT_SECRET;
const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.SECRET_KEY || "XStudy1130",
  "salt",
  32
);
const iv = crypto.randomBytes(16);

export interface ISuccessResponse {
  success: true;
  err?: object;
  message: string | Array<object> | object;
  status: number;
  data?: any;
}

export const response = {
  success: (res: any, status: number, message: string, data?: any) => {
    const response: ISuccessResponse = {
      success: true,
      message,
      status: status,
    };
    if (data) response.data = data;
    res.status(status).json(response);
  },
  validation: (
    res: any,
    status: number,
    msg: [] | string | object,
    data?: any
  ) => {
    const response: ISuccessResponse = {
      success: true,
      message: { validation: msg },
      status: status,
    };
    if (data) {
      const parsedData = JSON.parse(data);
      response.data = parsedData;
    }
    res.status(status).json(response);
  },
  fail: (res: any, status: number, message: string | object) => {
    res.status(status).json({
      success: true,
      message,
      status: status,
    });
  },
  internal: (res: any, status: number, message: string, error: any) => {
    res.status(status).json({
      success: false,
      message,
      status: status,
      error,
    });
  },
};

export const helper = {
  encryptBatch: async (texts: string[]) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    return texts.map((text) => {
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      return iv.toString("hex") + encrypted;
    });
  },
  encrypt: async (text: string) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + encrypted;
  },
  decrypt: async (encrypted: any): Promise<number | string> => {
    const iv = encrypted.slice(0, 32);
    const encryptedData = encrypted.slice(32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
  generateToken: (payload: object, expiresIn: string | number = "30d") => {
    return jwt.sign(payload, SECRET_KEY!, { expiresIn } as jwt.SignOptions);
  },
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, SECRET_KEY!);
    } catch (error) {
      return null;
    }
  },

};

export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}
