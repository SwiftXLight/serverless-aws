import { APIGatewayProxyHandler } from "aws-lambda";
import { customResponse, errorHandler } from "../utils/customHandlers";
import { scanLinksByOwner } from "../utils/db/requests/linkRequests";

export const listUserLinks: APIGatewayProxyHandler = async (event) => {
  try {
    const userEmail = event.requestContext.authorizer?.principalId as string;
    const links = await scanLinksByOwner(userEmail);

    return customResponse(200, { links });
  } catch (err) {
    return errorHandler(err);
  }
};
