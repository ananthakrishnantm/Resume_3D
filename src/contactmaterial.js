import * as CANNON from "cannon-es";

export function setupContactMaterials(world) {
  const materials = {
    default: new CANNON.Material("defaultMaterial"),
    wall: new CANNON.Material("wallMaterial"),
  };

  world.defaultMaterial = materials.default;

  const wallContactMaterial = new CANNON.ContactMaterial(
    maaterials.car,
    materials.wall,
    {
      friction: 0.8,
      restitution: 0.2,
    }
  );

  world.addContactMaterial
}
