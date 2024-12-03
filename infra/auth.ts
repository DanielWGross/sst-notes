// An example
// https://discord.com/channels/983865673656705025/1296118455631872062/1296134904974802997
import { api } from "./api";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const userPool = new sst.aws.CognitoUserPool("MyUserPool", {
  transform: {
    userPool: {
      autoVerifiedAttributes: ["email"],
      usernameAttributes: ["email"],
    },
  },
  triggers: {
    // preSignUp: {
    //   handler: "packages/functions/src/postAuth.main",
    //   permissions: [
    //     {
    //       actions: ["cognito-idp:ListUsers"],
    //       resources: ["*"],
    //     },
    //   ],
    // },
    postConfirmation: {
      handler: "packages/functions/src/postAuth.main",
      permissions: [
        {
          actions: ["cognito-idp:ListUsers", "cognito-idp:AdminAddUserToGroup"],
          resources: ["*"],
        },
      ],
    },
  },
});

const adminGroup = new aws.cognito.UserGroup("AdminGroup", {
  userPoolId: userPool.id,
  name: "admins",
  description: "Group for administrators",
  precedence: 0,
});

const userGroup = new aws.cognito.UserGroup("UserGroup", {
  userPoolId: userPool.id,
  name: "users",
  description: "Group for users",
  precedence: 1,
});

export const userPoolWebClient = userPool.addClient("Web", {
  transform: {
    client: {
      supportedIdentityProviders: ["COGNITO"],
    },
  },
});

export const identityPool = new sst.aws.CognitoIdentityPool("MyIdentityPool", {
  userPools: [
    {
      userPool: userPool.id,
      client: userPoolWebClient.id,
    },
  ],
  permissions: {
    authenticated: [
      {
        actions: ["s3:*"],
        resources: [
          $concat(
            bucket.arn,
            "/private/${cognito-identity.amazonaws.com:sub}/*"
          ),
        ],
      },
      {
        actions: ["execute-api:*"],
        resources: [
          $concat(
            "arn:aws:execute-api:",
            region,
            ":",
            aws.getCallerIdentityOutput({}).accountId,
            ":",
            api.nodes.api.id,
            "/*/*/*"
          ),
        ],
      },
    ],
  },
});
