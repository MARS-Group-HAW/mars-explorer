## Elephant geo model
This is a geo referenced model that incorporates different geo-sources like water points, a fence that bounds the movement area, the precipitation over time and biomass. Within an environment that is shaped by these inputs an `Elephant` moves around and consumes biomass.    

### LandscapeLayer
The `LandscapeLayer` holds different geo-referenced layers and spawns the `Elephant` agent in a `GeoHashEnvironment`.

### Elephant
The agent `Elephant` starts with energy and loses some in every step. If the agent has no energy left, it dies. While it has energy left, it moves towards the closest water point. There it consumes biomass to raise its energy level.