# Preview and distribution

## Recommended hiring package

Use three complementary surfaces:

1. the GitHub Pages case study for a zero-install overview;
2. the public repository for implementation depth; and
3. a narrated simulator recording for the complete mobile behavior.

This is more reliable for a hiring reviewer than requiring an iOS install.

## Expo Go during a live conversation

ClutchView remains compatible with Expo Go.

```bash
yarn install
yarn start --tunnel
```

Scan the QR code with Expo Go. A tunnel is appropriate for a scheduled
conversation, but it is not a permanent public preview and depends on the
development machine remaining online.

## EAS preview builds

An Expo account is required for EAS Build. The configured owner is `engrejo`.

The `preview` profile in `eas.json` creates an internal-distribution build:

```bash
npx eas-cli build --profile preview --platform android
```

Android internal distribution can produce an installable APK. A signed iOS
device build requires Apple Developer Program membership and registered
devices. TestFlight also requires paid Apple membership. Do not purchase it
solely for this application unless direct iOS installation becomes a hiring
requirement.

## Web

The project can start in a browser with `yarn web`, but the mobile app is the
primary artifact. Only publish the web app after checking replay timing,
responsive layout, keyboard interaction, and the absence of mobile-only
feedback regressions. The static case-study page is the recommended GitHub Pages
artifact.

## GitHub Pages

The case study lives in `docs/index.html` and uses only relative static assets.
In the repository settings:

1. open **Pages**;
2. choose **Deploy from a branch**;
3. select the publishing branch and `/docs`;
4. save and verify every navigation and repository link.

The canonical case study is part of the portfolio repository:

```text
https://jidemusty.github.io/clutchview/
```
