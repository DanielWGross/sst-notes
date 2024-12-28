import { api } from "./api";
import { identityPool, userPool, userPoolWebClient } from "./auth";
import { bucket } from "./storage";

const region = aws.getRegionOutput().name;

export const angular = new sst.aws.StaticSite("MyWeb", {
  path: "packages/angular",
  dev: {
    command: "npm run start",
  },
  build: {
    output: "dist/browser",
    command: "ng build --output-path dist",
  },
  environment: {
    NG_APP_REGION: region,
    NG_APP_API_URL: api.url,
    NG_APP_BUCKET: bucket.name,
    NG_APP_USER_POOL_ID: userPool.id,
    NG_APP_IDENTITY_POOL_ID: identityPool.id,
    NG_APP_USER_POOL_CLIENT_ID: userPoolWebClient.id,
  },
});
