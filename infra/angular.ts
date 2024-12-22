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
  },
});
