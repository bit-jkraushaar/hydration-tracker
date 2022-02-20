# Hydration Tracker

Hydration Tracker allow you to track your daily hydration.
The app is available via GitHub pages: https://bit-jkraushaar.github.io/hydration-tracker

## About

I wrote Hydration Tracker as Progressive Web App based on Angular.
It shows how PWAs can be used as alternative to native apps.
Hydration Tracker can be installed and provides notification support (experimental).

## Development

You may checkout the repository and start developing using the common Angular commands.
This repository also supports [Gitpod](https://gitpod.io).
The `.gitpod.yml` file contains everything you need to start.

## Testing the Service Worker

To test the Service Worker, you have to build the app in production mode.
As a shortcut run `npm run start-pwa`.
This builds the app und runs it using `http-server`.

## Testing Notifications

The app uses notifications to remind you of drinking water.
To implement notifications without server push, it uses the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API).
The API does not support triggering notifications in the background.
To implement this feature, the experimental [Notification Triggers API](https://bugs.chromium.org/p/chromium/issues/detail?id=891339) is used.
At the moment this API is only available in Chrome/Chromium and only after enabling an [experimental flag](https://web.dev/notification-triggers/#enabling-via-about:flags).
Also the API might be removed in the future.

To test notifications, start the app as described in 'Testing the Service Worker'.

## Deployment

This app uses the [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages) plugin to deploy the application on the ghpages website of this project.

## License

The app is licensed under GPL-3.0, see `LICENSE`.
