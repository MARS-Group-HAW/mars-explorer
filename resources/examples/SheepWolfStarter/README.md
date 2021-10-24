# SheepWolfStarter
A simple model based on a predator-prey system.

## Layer
All agents are initially placed on the GrassLandLayer (Grid) at random positions.

## Agents
There are three agent types in total: Grass(GrowthAgent), Sheep and Wolf.

### GrassGrowthAgent
The GrassGrowthAgent is responsible for growing grass on the grid.

### Sheep
With each tick, the sheep agent moves randomly across the layer and loses energy. 
If there is grass in the new position, it is eaten by the sheep increasing its energy. 
If the energy value drops to less than or equal to 0, the agent is killed. Sheep reproduce randomly.

### Wolf
The movement logic differs from that of the sheep in the sense that the wolves move towards the sheep when they are sufficiently close.
If they are on the same tile, the sheep agent is eaten and the wolf's energy increases.
The reproduction behavior is the same as the sheep agent.
