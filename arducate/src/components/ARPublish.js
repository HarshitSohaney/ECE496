// src/components/ARView.js
const convertSceneToAR = (arObjects) => {
  /**
   * Converts the list of visible arObjects to the HTML format to be published in AR.
   */
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
      </head>
      <body style="margin: 0; overflow: hidden;">
        <a-scene embedded arjs renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false" gesture-detector>
          <a-marker preset="hiro">
            ${arObjects
              .filter(object => object.visible !== false) // Only include visible objects
              .map((object) => {
                return `
                <a-entity>
                  <${object.entity} position="${object.position.join(" ")}"
                    scale="${object.scale.join(" ")}"
                    rotation="${object.rotation.join(" ")}"
                    color="${object.color}"></${object.entity}>
                  <a-text visible=${object.showLabel} 
                    value="${object.name || `Object ${object.id}`}"
                    position="${object.position[0]} ${-object.scale[1]} ${object.position[2]}"
                    render-order="1"
                    scale="0.5 0.5 0.5"
                    align="center"
                    color="#000000"
                    opacity="0.8"
                    side="double"></a-text>
                </a-entity>
              `;
              })
              .join("")}
          </a-marker>
          <a-entity camera></a-entity>
        </a-scene>
      </body>
      </html>
    `;
};

const convertSceneToVR = (arObjects) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>VR Environment</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
        <script src="https://aframe.io/extras/aframe-extras.min.js"></script>
        <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
      </head>
      <body>
        <a-scene>
          ${arObjects
            .filter(object => object.visible !== false) // Only include visible objects
            .map((object) => {
              return `
              <a-entity>
                <${object.entity} position="${object.position.join(" ")}"
                  scale="${object.scale.join(" ")}"
                  rotation="${object.rotation.join(" ")}"
                  color="${object.color}"></${object.entity}
                  text=${object.name}>
                <a-text visible=${object.showLabel} 
                        value="${object.name || `Object ${object.id}`}"
                  position="${object.position[0]} ${-object.scale[1]} ${object.position[2]}"
                  render-order="2"
                  scale="0.5 0.5 0.5"
                  align="center"
                  color="#000000"
                  opacity="0.8"
                  side="double"></a-text>
              </a-entity>
            `;
            })
            .join("")}
          <a-sky color="#ECECEC"></a-sky>
          <a-camera position="0 0 4" look-controls="enabled:true"></a-camera>
        </a-scene>
      </body>
      </html>
    `;
};

// Function to convert radians to degrees
const radiansToDegrees = (radians) => radians * (180 / Math.PI);

// Returns Label for Respective Asset
const renderTextLabel = (object) => `
  <a-text 
    visible="${object.showLabel}" 
    value="${object.name || `Object ${object.id}`}"
    position="${object.position[0]} ${-object.scale[1]} ${object.position[2]}"
    render-order="2"
    scale="0.5 0.5 0.5"
    align="center"
    color="#000000"
    opacity="0.8"
    side="double"></a-text>
`;

// Returns A-frame Entity for Asset
const renderObject = (object) => {
  const commonPosition = object.position.join(" ");
  const commonScale = object.scale.join(" ");
  const commonRotation = object.rotation.map(radiansToDegrees).join(" ");
  const commonTextLabel = renderTextLabel(object);

  switch (object.entity) {
    case 'a-text':
      return `
        <a-entity>
          <${object.entity} 
            value="${object.text}"
            align="center"
            anchor="center"
            position="${commonPosition}"
            scale="${commonScale}"
            rotation="${commonRotation}"
            color="#000000"></${object.entity}>
          ${commonTextLabel}
        </a-entity>
      `;

    case 'a-element':
      return `
        <a-entity>
          <a-entity 
            line="color: black; lineWidth: 2; start: 0 0 0; end: 0 2 0" 
            position="${commonPosition}"
            scale="${commonScale}"
            rotation="${commonRotation}">
          </a-entity>
          ${commonTextLabel}
        </a-entity>
      `;

    default:
      return `
        <a-entity>
          <${object.entity} 
            position="${commonPosition}"
            scale="${commonScale}"
            rotation="${commonRotation}"
            color="${object.color}"></${object.entity}>
          ${commonTextLabel}
        </a-entity>
      `;
  }
};

export { convertSceneToAR, convertSceneToVR };