import { APIGatewayProxyResult } from "aws-lambda";

export class CustomError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: unknown,
  message?: string
): APIGatewayProxyResult => {
  const headers = { "content-type": "application/json" };

  if (err instanceof CustomError) {
    return {
      statusCode: err.statusCode,
      headers,
      body: JSON.stringify({
        Error: message || err.message,
      }),
    };
  } else {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        Error: message || "Internal server error",
      }),
    };
  }
};

export const customResponse = (
  statusCode: number,
  message: string | Record<string, any>,
  headers?: Record<string, string>
): APIGatewayProxyResult => {
  let responseMessage: any;

  if (typeof message === "string") {
    responseMessage = { message };
  } else {
    responseMessage = message;
  }

  const response: APIGatewayProxyResult = {
    statusCode: statusCode,
    body: JSON.stringify(responseMessage),
    headers: headers || {},
  };

  return response;
};
