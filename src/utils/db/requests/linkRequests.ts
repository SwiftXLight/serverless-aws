import { UserLink } from "../../../interfaces/interfaces";
import { dynamoDb } from "../dynamoDb";

export async function getLinkItem(linkId: string): Promise<UserLink | null> {
  const params = {
    TableName: process.env.DYNAMODB_LINKS_TABLE,
    Key: {
      id: linkId,
    },
  };

  try {
    const result = await dynamoDb.get(params);

    return result.Item as UserLink | null;
  } catch (err) {
    throw err;
  }
}

export async function putLinkItem(linkItem: UserLink): Promise<void> {
  const params = {
    TableName: process.env.DYNAMODB_LINKS_TABLE,
    Item: linkItem,
  };

  try {
    await dynamoDb.put(params);
  } catch (err) {
    throw err;
  }
}

export async function scanLinksByOwner(
  userEmail: string
): Promise<Record<string, any>> {
  const params = {
    TableName: process.env.DYNAMODB_LINKS_TABLE,
    FilterExpression: "ownerEmail = :email",
    ExpressionAttributeValues: {
      ":email": userEmail,
    },
  };

  try {
    const result = await dynamoDb.scan(params);

    return result.Items || [];
  } catch (err) {
    throw err;
  }
}

export async function deactivateLink(linkId: string): Promise<void> {
  const params = {
    TableName: process.env.DYNAMODB_LINKS_TABLE,
    Key: { id: linkId },
  };

  try {
    await dynamoDb.delete(params);
  } catch (err) {
    throw err;
  }
}

export async function updateVisitCount(linkId: string): Promise<void> {
  const params = {
    TableName: process.env.DYNAMODB_LINKS_TABLE,
    Key: { id: linkId },
    UpdateExpression: "SET visitCount = visitCount + :increment",
    ExpressionAttributeValues: {
      ":increment": 1,
    },
  };

  try {
    await dynamoDb.update(params);
  } catch (err) {
    throw err;
  }
}
