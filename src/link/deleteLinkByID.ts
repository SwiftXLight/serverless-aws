import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CustomError,
  customResponse,
  errorHandler,
} from "../utils/customHandlers";
import { deactivateLink, getLinkItem } from "../utils/db/requests/linkRequests";

export const deleteLinkByID: APIGatewayProxyHandler = async (event) => {
  try {
    const userEmail = event.requestContext.authorizer?.principalId as string;
    const shortId = event.pathParameters?.id;

    if (!shortId) {
      throw new CustomError(400, "Short link ID is missing in the request.");
    }

    const linkItem = await getLinkItem(shortId);

    if (!linkItem) {
      throw new CustomError(404, "Short link not found.");
    }

    if (linkItem.ownerEmail !== userEmail) {
      throw new CustomError(403, "You are not allowed to delete this link.");
    }

    await deactivateLink(shortId);

    return customResponse(
      302,
      `Short link ${shortId} for ${linkItem.originalLink} seccessfully deleted`
    );
  } catch (err) {
    return errorHandler(err);
  }
};
