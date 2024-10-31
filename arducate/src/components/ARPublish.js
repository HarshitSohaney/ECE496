const generateAnimations = (keyframes) => {
  if (!keyframes || keyframes.length === 0) return "";
  console.log(keyframes);
  const animations = keyframes
    .map((kf, index) => {
      if (!kf.position.start || !kf.position.end) {
        console.warn(`Keyframe ${kf.id} is missing position start/end`);
      }
      const duration = kf.end !== null ? (kf.end - kf.start) * 1000 : 0;
      const from = kf.position.start.join(" ");
      const to = kf.position.end ? kf.position.end.join(" ") : from; // Use `from` as `to` if no end

      return `animation__${index}="property: position; from: ${from}; to: ${to}; dur: ${duration}; startEvents: startAnimation${index}; pauseEvents: pauseAnimation${index};"`;
    })
    .filter(Boolean)
    .join(" ");

  return animations;
};

const convertSceneToAR = (arObjects) => {
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
            ${arObjects.map(object => renderObject(object)).join("")}
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
      </head>
      <body>
        <a-scene>
          ${arObjects.map(object => renderObject(object)).join("")}
          <a-sky color="#ECECEC"></a-sky>
          <a-camera position="0 0 4" look-controls="enabled:true"></a-camera>
        </a-scene>
      </body>
      </html>
    `;
};


export { convertSceneToAR, convertSceneToVR };
