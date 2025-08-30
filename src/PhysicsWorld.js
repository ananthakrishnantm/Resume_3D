import * as CANNON from "cannon-es";

export function PhysicsWorld() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  function update() {
    world.step(1 / 60);
  }

  return { world, update };
}
