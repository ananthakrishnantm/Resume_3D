// --- Interactable Manager --- //

export const interactables = [];

// Add an interactable object
export function registerInteractable(object, onInteract, options = {}) {
  object.userData.onInteract = onInteract;
  object.userData.interactDistance = options.distance || 1.5;

  interactables.push(object);
}

// Get the nearest interactable based on player position
export function getNearestInteractable(playerPos) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (let obj of interactables) {
    const dist = playerPos.distanceTo(obj.position);

    if (dist < obj.userData.interactDistance && dist < nearestDistance) {
      nearest = obj;
      nearestDistance = dist;
    }
  }

  return nearest;
}
