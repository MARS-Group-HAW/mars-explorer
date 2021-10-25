## RandomGridMove model
This is a simple random move model on a grid. An agent of type `Murkel` moves randomly over given grid and consumes the energy that is stored in the cells.

### MyGridLayer
The `MyGridLayer` holds the 10x10 grid in a GeoHashEnvironment.

### Murkel
The agent `Murkel` starts with energy and loses some in every step. If the agent has no energy left, it dies. While it has energy left, it moves randomly over the grid and consumer the energy that is stored in the layer at that very position. While the agent has more than 50 energy it can jump to any position, below 50 it only moves to adjacent cells.