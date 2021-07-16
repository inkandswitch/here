# Here

A local-first, identity-less location sharing app riffing off of backchannel libraries.

## Running locally

1. Run `yarn` to install dependencies.
2. In `Map.tsx`, add Mapbox API key in the line `mapboxgl.accessToken = ''`
3. You need one terminal running `yarn start` for the UI, and another running `yarn relay` for the backend.
