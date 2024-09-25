// src/components/ARView.js
const convertSceneToAR = (arObjects) => {
    /**
     * Converts the list of arObjects to the HTML format to be published in AR.
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
              .map((object) => {
                return `
                <a-entity>
                  <${object.entity} position="${object.position.join(" ")}"
                    scale="${object.scale.join(
                      " "
                    )}" rotation="${object.rotation.join(" ")}"
                    color="${object.color}"></${object.entity}>
                  <a-text visible=${object.showLabel} value="${object.name || `Object ${object.id}`}"
                    position="${object.position[0]} ${
                  parseFloat(object.position[1]) - parseFloat(
                    object.scale[1]
                  ) / 2
                } ${object.position[2]}"
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
        <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
      </head>
      <body>
        <a-scene>
          ${arObjects
            .map((object) => {
              return `
              <a-entity>
                <${object.entity} position="${object.position.join(" ")}"
                  scale="${object.scale.join(
                    " "
                  )}" rotation="${object.rotation.join(" ")}"
                  color="${object.color}"></${object.entity}>
                <a-text visible=${object.showLabel} value="${object.name || `Object ${object.id}`}"
                  position="${object.position[0]} ${
                parseFloat(object.position[1]) - parseFloat(
                  object.scale[1]
                ) / 2
              } ${object.position[2]}"
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

export { convertSceneToAR, convertSceneToVR };
