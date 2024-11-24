import { renderObject } from "./utils"; // Ensure renderObject is imported

export const convertSceneToVR = (vrObjects) => {
  // Validate input
  if (!Array.isArray(vrObjects)) {
    console.error("vrObjects must be an array");
    return "";
  }

  // Create the HTML structure
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WebVR Scene</title>
      <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
      <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
      <script src="./globalAnimationCoordinator.js"></script>
    </head>
    <body style="margin: 0; overflow: hidden;">
      <a-scene>
        <a-entity position="0 1.5 0">
          ${vrObjects.filter(object => object.visible !== false).map(object => renderObject(object)).join("")}
        </a-entity>
        
        <!-- Camera with movement and look controls -->
        <a-entity camera look-controls wasd-controls position="0 1 3"></a-entity>
      </a-scene>
    </body>
    </html>`;
};
