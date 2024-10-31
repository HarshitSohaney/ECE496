import { renderObject } from "./utils"; // Ensure renderObject is imported

export const convertSceneToVR = (vrObjects) => {
  if (!Array.isArray(vrObjects)) {
    console.error("vrObjects must be an array");
    return "";
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WebVR Scene</title>
      <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
      <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
      <script src="https://aframe.io/extras/aframe-extras.min.js"></script>
      <script src="./globalAnimationCoordinator.js"></script>
    </head>
    <body style="margin: 0; overflow: hidden;">
      <a-scene embedded>
          ${vrObjects.map(object => renderObject(object)).join("")}
          <a-sky color="#ECECEC"></a-sky>
          <a-camera position="0 0 4" look-controls="enabled:true"></a-camera>
      </a-scene>
    </body>
    </html>`;
};
