import {
  SchedulerClient,
  CreateScheduleCommandInput,
} from "@aws-sdk/client-scheduler";
import { INewSchedule } from "../interfaces/interfaces";

export const schedulerClient = new SchedulerClient({});

export function createNewScheduleCommand({
  time,
  email,
  id,
}: INewSchedule): CreateScheduleCommandInput {
  return {
    FlexibleTimeWindow: {
      Mode: "OFF",
    },
    GroupName: "deleteLink",
    Name: `expired_link_${id}`,
    ScheduleExpression: `at(${time})`,
    Target: {
      Arn: `arn:aws:lambda:${process.env.REGION}:${process.env.ACCOUNT_ID}:function:shortlinker-${process.env.STAGE}-deleteExpiredLinks`,
      RoleArn: `arn:aws:iam::${process.env.ACCOUNT_ID}:role/MainRole`,
      Input: JSON.stringify({ id, email }),
    },
  };
}
