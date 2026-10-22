import * as CANNON from "cannon-es";

export function PhysicsWorld() {
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0);
  world.broadphase = new CANNON.NaiveBroadphase();
  world.solver.iterations = 10;

  const fixedTimeStep = 1 / 60;
  const maxSubSteps = 3;

  function update(delta) {
    world.step(fixedTimeStep, delta, maxSubSteps);
  }

  return { world, update };
}
