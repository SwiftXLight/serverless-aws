import { APIGatewayProxyHandler } from "aws-lambda";
import { generateJwtToken } from "../utils/token";
import {
  CustomError,
  customResponse,
  errorHandler,
} from "../utils/customHandlers";
import { hashUsersPassword } from "../utils/hashPassword";
import { getUserByEmail, putUserItem } from "../utils/db/requests/userRequests";
import { User } from "../interfaces/interfaces";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const body: User = JSON.parse(event.body!);

    if (!body.email || !body.password) {
      throw new CustomError(
        400,
        "Email and password are required for registration"
      );
    }

    if (!emailRegex.test(body.email)) {
      throw new CustomError(400, "Invalid email format");
    }

    if (body.password.length < 8) {
      throw new CustomError(400, "Password must be at least 8 characters long");
    }

    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      throw new CustomError(409, "Email already registered");
    }

    const hashedPassword = hashUsersPassword(body.password);

    const params = {
      primary_key: body.email,
      password: hashedPassword,
    };

    await putUserItem(params);

    const jwtToken = await generateJwtToken(body.email);

    return customResponse(201, jwtToken);
  } catch (err) {
    return errorHandler(err);
  }
};
