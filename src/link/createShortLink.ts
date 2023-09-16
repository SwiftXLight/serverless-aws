import { APIGatewayEvent } from "aws-lambda";
import {
  createNewScheduleCommand,
  schedulerClient,
} from "../utils/schedulerClient";
import { CreateScheduleCommand } from "@aws-sdk/client-scheduler";
import { CustomError, customResponse } from "../utils/customHandlers";
import { calculateExpirationDate } from "../utils/calculateExpirationDate";
import { putLinkItem } from "../utils/db/requests/linkRequests";
import { generateShortID } from "../utils/generateShortID";
import { isValidUrl } from "../utils/validateURL";

const deploymentURL = process.env.DEPLOYMENT_URL;

export const createShortLink = async (event: APIGatewayEvent) => {
  try {
    const { originalLink, expirationTime } = JSON.parse(event.body!);
    const userEmail = event.requestContext.authorizer?.principalId;

    if (!originalLink || !expirationTime) {
      return new CustomError(
        400,
        "Both originalLink and expirationTime are required."
      );
    }

    if (!isValidUrl(originalLink)) {
      return new CustomError(400, "Invalid originalLink URL format.");
    }
    const shortId = generateShortID();
    const formattedExpirationTime = calculateExpirationDate(expirationTime);

    const shortenedLink = {
      id: shortId,
      ownerEmail: userEmail,
      originalLink,
      expirationTime: formattedExpirationTime,
      visitCount: 0,
    };

    try {
      await putLinkItem(shortenedLink);
    } catch (err) {
      return new CustomError(500, "An error occurred while creating the link.");
    }
    if (formattedExpirationTime !== "one-time") {
      const newSchedule = createNewScheduleCommand({
        time: formattedExpirationTime.split(".")[0],
        email: userEmail,
        id: shortId,
      });
      try {
        await schedulerClient.send(new CreateScheduleCommand(newSchedule));
      } catch (err) {
        return new CustomError(
          500,
          "An error occurred while scheduling the link deletion."
        );
      }
    }
    return customResponse(200, `${deploymentURL}${shortId}`);
  } catch (err) {
    return new CustomError(400, "Invalid request body.");
  }
};
