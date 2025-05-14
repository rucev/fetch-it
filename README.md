# Fetch It (wip)

> ⚠️ This project is a **work in progress** and is currently **not open for external collaboration** until the MVP (Minimum Viable Product) is released.

## Project Purpose

This tool allows developers to:

- Test API requests entirely on the **client side**, with **no server or network proxy involved** — keeping all data fully private.
- Generate corresponding **cURL commands** based on the request configuration for use in terminals or scripts.

It's especially useful for:

- Quickly experimenting with HTTP methods, headers, and request bodies.
- Copying a shareable or reproducible `curl` equivalent of a request.
- Maintaining privacy when testing sensitive endpoints.

## Tech Stack

- [Vue 3](https://vuejs.org/) and [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PrimeIcons](https://primevue.org/icons/)
- Fully client-side architecture (no backend)

## Features

- Fill out request details (URL, method, headers, body)
- Real-time response display
- `curl` command generator
- Optional verbose flag (wip)
- Validation of URLs, headers, and HTTP methods
- Save and group calls in localStorage (wip)
- Easy copy-paste function (wip)
- Export (download) and Import downloaded calls in a json (wip)

## Status

Currently under development. Not yet ready for production use.

Collaborations and contributions will be welcome **after the MVP is released**. Stay tuned!

## Structure Overview

```
src/
├── components/ # Vue components (forms, response display, buttons)
├── core/
|   ├── validators/
|   ├── constants/
|   ├── interfaces/ # Type definitions
|   ├── generateCurl.ts
|   └── fetchIt.ts
└── App.vue # Root component
```

