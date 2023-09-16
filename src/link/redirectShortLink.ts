import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CustomError,
  customResponse,
  errorHandler,
} from "../utils/customHandlers";
import {
  deactivateLink,
  getLinkItem,
  updateVisitCount,
} from "../utils/db/requests/linkRequests";

export const redirectShortLink: APIGatewayProxyHandler = async (event) => {
  try {
    const shortId = event.pathParameters?.id;
    if (!shortId) {
      throw new CustomError(400, "Short link ID is missing in the request.");
    }

    const linkItem = await getLinkItem(shortId);

    if (!linkItem) {
      throw new CustomError(404, "Short link not found.");
    }

    linkItem.expirationTime === "one-time"
      ? await deactivateLink(shortId)
      : await updateVisitCount(shortId);

    return customResponse(302, "", {
      Location: linkItem.originalLink,
    });
  } catch (err) {
    return errorHandler(err);
  }
};
