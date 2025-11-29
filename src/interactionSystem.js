import { getNearestInteractable, interactables } from "./interactables.js";
import * as THREE from "three";

let playerPosRef = null;

export function setPlayerPositionReference(getPlayerPosFn) {
  playerPosRef = getPlayerPosFn;
}

export function setupInteractionInput() {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (!playerPosRef) {
        return;
      }

      const playerPos = playerPosRef();

      if (!playerPos) {
        return;
      }

      const nearest = getNearestInteractable(playerPos);

      if (nearest && nearest.userData.onInteract) {
        nearest.userData.onInteract();
      }
    }
  });
}
