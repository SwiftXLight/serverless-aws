import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  PolicyDocument,
} from "aws-lambda";
import { sign, verify } from "jsonwebtoken";
import { DecodedToken } from "../interfaces/interfaces";

const jwtSecret = process.env.JWT_SECRET ?? "test";

export function generateJwtToken(email: string): string {
  return sign({ email }, jwtSecret, { expiresIn: "1h" });
}

export async function verifyToken(
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> {
  try {
    const token = event.authorizationToken.split(" ")[1];

    const decodedToken = verify(token, jwtSecret) as DecodedToken;
    const userEmail = decodedToken?.email;

    if (!userEmail) {
      throw new Error("Invalid token");
    }

    return new VerifyResponse(userEmail, "Allow", event.methodArn);
  } catch (err) {
    return new VerifyResponse("user", "Deny", event.methodArn);
  }
}

class VerifyResponse implements APIGatewayAuthorizerResult {
  principalId: string;
  policyDocument: PolicyDocument;
  constructor(email: string, effect: "Allow" | "Deny", method: string) {
    this.principalId = email;
    this.policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: method,
        },
      ],
    };
  }
}
