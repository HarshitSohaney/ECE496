import { renderObject } from "./utils";
// convertSceneToAR.js
import { renderObject } from "./utils";

export const convertSceneToAR = (arObjects) => {
  // Validate input
  if (!Array.isArray(arObjects)) {
    console.error("arObjects must be an array");
    return "";
  }

  // Create the HTML structure
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
      <title>Marker-based WebAR</title>
      <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
      <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
      <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
      <script src="./globalAnimationCoordinator.js"></script>
    </head>
    <body style="margin: 0; overflow: hidden;">
      <a-scene embedded arjs="detectionMode: mono_and_matrix; matrixCodeType: 3x3;" renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false">
        <a-marker preset="hiro" global-animation-coordinator>
          <a-entity position="0 1.5 0">
            ${arObjects.map(renderObject).join("")}
          </a-entity>
        </a-marker>
        <a-entity camera></a-entity>
      </a-scene>
    </body>
    </html>`;
};
