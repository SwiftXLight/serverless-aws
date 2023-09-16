import { IUserItem, User } from "../../../interfaces/interfaces";
import { dynamoDb } from "../dynamoDb";

export async function getUserByEmail(email: string): Promise<User | null> {
  const params = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Key: {
      primary_key: email,
    },
  };

  try {
    const result = await dynamoDb.get(params);

    if (result.Item) {
      const user: User = result.Item as User;

      return user;
    }

    return null;
  } catch (err) {
    return null;
  }
}

export async function putUserItem(userItem: IUserItem): Promise<void> {
  const params = {
    TableName: process.env.DYNAMODB_USERS_TABLE,
    Item: userItem,
  };

  try {
    await dynamoDb.put(params);
  } catch (err) {
    throw err;
  }
}
