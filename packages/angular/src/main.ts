import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: import.meta.env['NG_APP_REGION'],
    userPoolId: import.meta.env['NG_APP_USER_POOL_ID'],
    identityPoolId: import.meta.env['NG_APP_IDENTITY_POOL_ID'],
    userPoolWebClientId: import.meta.env['NG_APP_USER_POOL_CLIENT_ID'],
  },
  Storage: {
    region: import.meta.env['NG_APP_REGION'],
    bucket: import.meta.env['NG_APP_BUCKET'],
    identityPoolId: import.meta.env['NG_APP_IDENTITY_POOL_ID'],
  },
  API: {
    endpoints: [
      {
        name: 'notes',
        endpoint: import.meta.env['NG_APP_API_URL'],
        region: import.meta.env['NG_APP_REGION'],
      },
    ],
  },
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
