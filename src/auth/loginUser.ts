import { APIGatewayProxyHandler } from "aws-lambda";
import { User } from "../interfaces/interfaces";
import {
  CustomError,
  customResponse,
  errorHandler,
} from "../utils/customHandlers";
import { getUserByEmail } from "../utils/db/requests/userRequests";
import { checkPasswords } from "../utils/hashPassword";
import { generateJwtToken } from "../utils/token";

export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const body: User = JSON.parse(event.body!);

    if (!body.email || !body.password) {
      throw new CustomError(400, "Email and password are required for login");
    }

    const user = await getUserByEmail(body.email);
    if (!user) {
      throw new CustomError(404, "User not found");
    }

    const isPasswordValid = await checkPasswords(body.password, user.password);
    if (!isPasswordValid) {
      throw new CustomError(401, "Invalid password");
    }

    const jwtToken = await generateJwtToken(body.email);

    return customResponse(200, jwtToken);
  } catch (err) {
    return errorHandler(err);
  }
};
