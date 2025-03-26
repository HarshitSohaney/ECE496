import { renderObject } from "./utils";

export const convertSceneToAR = (arObjects) => {
  if (!Array.isArray(arObjects)) {
    console.error("arObjects must be an array");
    return "";
  }

  const wrappedGroup = `
    <a-entity
      id="group-wrapper"
      class="clickable"
      gesture-handler
      position="0 0 0"
      rotation="0 0 0"
      scale="1 1 1"
    >
      ${arObjects
        .filter((object) => object.visible !== false)
        .map(renderObject)
        .join("")}
    </a-entity>
  `;

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
    <script src="https://cdn.jsdelivr.net/gh/fcor/arjs-gestures/gesture-detector.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/fcor/arjs-gestures/gesture-handler.js"></script>

  </head>
  <body style="margin: 0; overflow: hidden;">
    <a-scene embedded arjs="detectionMode: mono_and_matrix; matrixCodeType: 3x3;" renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false" gesture-detector id="scene">
      <a-marker preset="hiro" global-animation-coordinator raycaster="objects: .clickable"
        emitevents="true"
        cursor="fuse: false; rayOrigin: mouse;"
        id="markerA">
        ${wrappedGroup}
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  </body>
  </html>`;
};
