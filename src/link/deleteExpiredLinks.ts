import { DeleteScheduleCommand } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "../utils/schedulerClient";
import { sqsClient } from "../utils/sqs/sqsClient";
import {
  CustomError,
  customResponse,
  errorHandler,
} from "../utils/customHandlers";
import { IDeleteExpiredShortLink } from "../interfaces/interfaces";
import { deactivateLink } from "../utils/db/requests/linkRequests";

const queueUrl = process.env.THE_QUEUE_URL;

export const deleteExpiredLinks = async (data: IDeleteExpiredShortLink) => {
  try {
    const { id, email } = data;

    const sqsParams = {
      MessageBody: JSON.stringify({
        id,
        email,
      }),
      QueueUrl: `${queueUrl}`,
    };
    try {
      await deactivateLink(id);
      await sqsClient.sendMessage(sqsParams);

      await schedulerClient.send(
        new DeleteScheduleCommand({
          Name: `expired_link_${id}`,
          GroupName: "deleteLink",
        })
      );
    } catch (err) {
      return new CustomError(
        500,
        "An error occurred while deleting the short link."
      );
    }

    return customResponse(200, "Short link deleted successfully.");
  } catch (err) {
    return errorHandler(err);
  }
};
