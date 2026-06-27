# Make Vienna Cool

Make Vienna Cool is an independent open-source project that helps people living in Vienna, or visiting Vienna, find places to cool down during heat waves, find public drinking water, and locate monitored places to swim or refresh themselves.

Too few homes in Vienna have air conditioning. During extreme heat this can become dangerous, especially for vulnerable people, older people, children, people with health conditions, and anyone who is overheated or has nowhere cool to rest. I could not find a comprehensive public map or database of air-conditioned and cool indoor public spaces in Vienna, so I started this project.

The City of Vienna already publishes its Coole Zonen list, and those spots are integrated here. That list is important, but it does not cover many other useful places such as libraries, malls, pubs, cafes, bookstores, fast-food places, and other low-barrier indoor spaces where people can sit for a while.

The app now keeps three datasets separate in the interface and in source files:

- cool and air-conditioned places
- public drinking-water points
- monitored bathing sites and public water-refresh features

Most places in this database come from:

- the City of Vienna Coole Zonen list
- Reddit threads where Viennese people asked for help finding cool places
- OpenStreetMap places tagged with positive `air_conditioning=*` values
- City of Vienna Open Government Data for public drinking-water points
- City of Vienna Open Government Data for monitored bathing-water sites

Thank you to OpenStreetMap and its contributors. Without OpenStreetMap, this project would not be possible.

## Contributing

Make Vienna Cool is meant to be collaborative. The goal is to add as many useful places as possible and keep the database accurate over time.

In general, cool-place entries should be places where people can stop, sit, study, wait, rest, or spend some time. Places that people only pass through, such as grocery stores or short-stop retail spaces, should usually not be added.

Drinking-water and water-refresh entries are separate datasets. Do not mix them into the cool-place list unless the location also independently qualifies as a place to spend time indoors or cool down.

It is strictly forbidden to use this project to sponsor or promote commercial activities. The database is for public heat-safety help, not advertising. Contributions will be monitored with this in mind.

## Data Maintenance

The current place database lives in `src/data/`.

- `vienna_cool_places.ts` and `osm_imported_places.ts` contain cool and air-conditioned places.
- `water_places.ts` contains generated drinking-water and water-refresh datasets.
- `scripts/generate_water_places.mjs` regenerates `water_places.ts` from downloaded City of Vienna WFS GeoJSON files.

To refresh water data, download the source layers to `C:\tmp\trinkbrunnen.json` and `C:\tmp\badestellen.json`, then run:

```bash
npm run generate:water-data
```

Wrong-information reports can be submitted through a Cloudflare Worker. Copy `wrangler.example.toml`, configure the Worker secrets, deploy the Worker, and set these frontend environment variables for the app build:

```bash
VITE_REPORT_ENDPOINT=https://your-worker.example
VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
```

## Local Development

Prerequisite: Node.js.

```bash
npm install
npm run dev
```

The app is a Vite/React map application. The current place database lives in `src/data/`.

## License

This project is released under the MIT License. OpenStreetMap data is available under the Open Database License; see https://www.openstreetmap.org/copyright.
