# Make Vienna Cool

![Screenshot of the Make Vienna Cool app](./Screenshot_ReadMe.png)

Make Vienna Cool is an independent open-source project that helps people living in Vienna, or visiting Vienna, find places to cool down during heat waves, find public drinking water, locate monitored places to swim or refresh themselves, and find public toilets.

Too few homes in Vienna have air conditioning. During extreme heat this can become dangerous, especially for vulnerable people, older people, children, people with health conditions, and anyone who is overheated or has nowhere cool to rest. I could not find a comprehensive public map or database of air-conditioned and cool indoor public spaces in Vienna, so I started this project.

The City of Vienna already publishes its Coole Zonen list, and those spots are integrated here. That list is important, but it does not cover many other useful places such as libraries, malls, pubs, cafes, bookstores, fast-food places, and other low-barrier indoor spaces where people can sit for a while.

The app keeps four datasets separate in the interface and in source files:

- cool and air-conditioned places
- public drinking-water points
- monitored bathing sites and public water-refresh features
- public toilets

Most places in this database come from:

- the City of Vienna Coole Zonen list
- Reddit threads where Viennese people asked for help finding cool places
- OpenStreetMap places tagged with positive `air_conditioning=*` values
- City of Vienna Open Government Data for public drinking-water points
- City of Vienna Open Government Data for monitored bathing-water sites
- OpenStreetMap public-toilet points, with City of Vienna public-WC pages used as source context

Thank you to OpenStreetMap and its contributors. Without OpenStreetMap, this project would not be possible. Thank you also to data.gv.at, Austria's open-data portal, and to the City of Vienna Open Government Data program for curating and publishing the public open data used by this project.

## Why this project?

The urge to develop this project came from a practical gap: Google Maps does not offer an air-conditioning filter for places, and in my testing it was not very good at finding all of Vienna's public drinking-water fountains.

The City of Vienna does offer official maps for drinking-water fountains, places to swim, and public toilets, but those maps can be hard to navigate and are not optimized for mobile use. This project puts cool indoor places, public drinking water, swim/refresh spots, and public toilets into one mobile-friendly interface.

## Contributing

Make Vienna Cool is meant to be collaborative. The goal is to add as many useful places as possible and keep the database accurate over time.

In general, cool-place entries should be places where people can stop, sit, study, wait, rest, or spend some time. Places that people only pass through, such as grocery stores or short-stop retail spaces, should usually not be added.

Drinking-water, water-refresh, and public-toilet entries are separate datasets. Do not mix them into the cool-place list unless the location also independently qualifies as a place to spend time indoors or cool down.

Wrong-information reports submitted through the app are automatically opened as issues in this repository, so they can be reviewed and fixed in public.

It is strictly forbidden to use this project to sponsor or promote commercial activities. The database is for public heat-safety help, not advertising. Contributions will be monitored with this in mind.

## Data Maintenance

The current place database lives in `src/data/`.

Future data-maintenance effort should focus mostly on expanding and improving the cool-places database. The drinking-water and swim/refresh datasets come from official open-data layers and are expected to be more or less complete, although they should still be refreshed periodically. Public-toilet data currently comes from OpenStreetMap and should be reviewed periodically for fees, accessibility, closures, and naming quality.

- `vienna_cool_places.ts` and `osm_imported_places.ts` contain cool and air-conditioned places.
- `drinking_water_places.ts` contains generated public drinking-water points.
- `water_access_places.ts` contains generated bathing sites and public water-refresh features.
- `public_toilet_places.ts` contains generated public-toilet points.
- `scripts/generate_water_places.mjs` regenerates the water files from downloaded City of Vienna WFS GeoJSON files.
- `scripts/generate_public_toilets.mjs` regenerates public toilets from an OpenStreetMap `amenity=toilets` export and can use the same compact Vienna address layer for clearer display names.

To refresh water data, download the source layers to `C:\tmp\trinkbrunnen.json` and `C:\tmp\badestellen.json`. For better fountain and spray-feature names, also download the trimmed `ogdwien:ADRESSENOGD` layer to `C:\tmp\adressen_compact.json` with `NAME`, `NAME_STR`, `PLZ`, `GEB_BEZIRK`, and `SHAPE`. Then run:

```bash
npm run generate:water-data
```

To refresh public-toilet data, export Vienna OpenStreetMap `amenity=toilets` objects to `C:\tmp\vienna_public_toilets_osm.json`. For address-based names, keep the same compact `ogdwien:ADRESSENOGD` file at `C:\tmp\adressen_compact.json`. Then run:

```bash
npm run generate:toilet-data
```

Wrong-information reports can be submitted through a Cloudflare Worker. Copy `wrangler.example.toml`, configure the Worker secrets, deploy the Worker, and set these frontend environment variables for the Vite app build. `VITE_REPORT_ENDPOINT` is not a Vite route; it is the frontend build variable used by `src/components/PlaceDetailCard.tsx`, and its value should be the deployed Worker URL:

```bash
VITE_REPORT_ENDPOINT=https://your-worker.example
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

Store private report-flow secrets only in Cloudflare Worker secrets:

```bash
wrangler secret put TURNSTILE_SECRET_KEY
wrangler secret put GITHUB_TOKEN
```

Use a fine-grained GitHub token limited to issue read/write access on this repository. If a token has ever been pasted into chat, rotate it before saving it.

## Local Development

Prerequisite: Node.js.

```bash
npm install
npm run dev
```

The app is a Vite/React map application. The current place database lives in `src/data/`.

## License

This project is released under the MIT License. OpenStreetMap data is available under the Open Database License; see https://www.openstreetmap.org/copyright.
