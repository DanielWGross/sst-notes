import { Handler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export const main: Handler = async (_event: any) => {
  console.log("Received event:", JSON.stringify(_event, null, 2));
  try {
    const client = new CognitoIdentityProviderClient({});
    const email = _event.request.userAttributes.email as string;
    // const isEmailVerified =
    //   _event.request.userAttributes.email_verified === "true";

    const isAdmin = email === "d.anwgross@gmail.com";
    const input = {
      GroupName: isAdmin ? "admins" : "users",
      UserPoolId: _event.userPoolId,
      Username: _event.userName,
    };

    const command = new AdminAddUserToGroupCommand(input);
    const response = await client.send(command);
    console.log("AdminAddUserToGroupCommand response:", response);

    return _event;
  } catch (error) {
    console.error("Error adding user to group:", error);
    throw new Error("Failed to add user to group.");
  }
};
