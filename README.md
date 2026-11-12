# CORS Toggle

A Chrome extension that turns cross-origin requests on or off with one click. Website: https://cors.itsash.in

Click the toolbar icon to switch it on. While it's on, the icon is blue with an **ON** badge and the extension adds these headers to every fetch/XHR response:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
Access-Control-Allow-Headers: *
Access-Control-Expose-Headers: *
```

Turn it off when you finish testing: while it's on, any site you open can read responses from other sites that don't need a sign-in. Credentialed requests (cookies) still need the server's own CORS headers, because the origin is `*`.

## Layout

| Path | What it is |
| --- | --- |
| `extension/` | The extension (Manifest V3, no build step). Load this folder unpacked. |
| `site/` | Landing page, deployed to GitHub Pages at cors.itsash.in. |
| `store-assets/` | Chrome Web Store images. `src/` holds the HTML they're rendered from. |

## Commands

```sh
make zip           # build cors-toggle.zip for the Chrome Web Store
make store-assets  # re-render the store images with headless Chrome
make site          # re-render, then copy the images the landing page uses into site/assets
```

## Install from source

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the `extension/` folder.
