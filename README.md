# Make Vienna Cool

Make Vienna Cool is an independent open-source project that helps people living in Vienna, or visiting Vienna, find places to cool down during heat waves.

Too few homes in Vienna have air conditioning. During extreme heat this can become dangerous, especially for vulnerable people, older people, children, people with health conditions, and anyone who is overheated or has nowhere cool to rest. I could not find a comprehensive public map or database of air-conditioned and cool indoor public spaces in Vienna, so I started this project.

The City of Vienna already publishes its Coole Zonen list, and those spots are integrated here. That list is important, but it does not cover many other useful places such as libraries, malls, pubs, cafes, bookstores, fast-food places, and other low-barrier indoor spaces where people can sit for a while.

Most places in this database come from:

- the City of Vienna Coole Zonen list
- Reddit threads where Viennese people asked for help finding cool places
- OpenStreetMap places tagged with positive `air_conditioning=*` values

Thank you to OpenStreetMap and its contributors. Without OpenStreetMap, this project would not be possible.

## Contributing

Make Vienna Cool is meant to be collaborative. The goal is to add as many useful places as possible and keep the database accurate over time.

In general, places in the database should be places where people can stop, sit, study, wait, rest, or spend some time. Places that people only pass through, such as grocery stores or short-stop retail spaces, should usually not be added.

It is strictly forbidden to use this project to sponsor or promote commercial activities. The database is for public heat-safety help, not advertising. Contributions will be monitored with this in mind.

## Roadmap

- Add more air-conditioned and cool places.
- Add public water fountains.
- Add safe water-access points where people can swim or cool down in Vienna's water bodies.
- Explore a generosity system where Viennese people with air conditioning at home can host vulnerable or overheated people in exchange for gratitude and smiles.

## Local Development

Prerequisite: Node.js.

```bash
npm install
npm run dev
```

The app is a Vite/React map application. The current place database lives in `src/data/`.

## License

This project is released under the MIT License. OpenStreetMap data is available under the Open Database License; see https://www.openstreetmap.org/copyright.
