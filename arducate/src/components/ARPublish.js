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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Marker-based WebAR</title>
            <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
            <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
        </head>

        <body style="margin: 0; overflow: hidden;">
            <a-scene embedded arjs renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false" gesture-detector>
                <a-marker preset="hiro">
                    ${arObjects.map(object => {
                        switch (object.type) {
                            case "box":
                                return `<a-box position="${object.position.join(" ")}" scale="${object.scale.join(" ")}" color="${object.color}"></a-box>`;
                            case "sphere":
                                return `<a-sphere position="${object.position.join(" ")}" scale="${object.scale.join(" ")}" color="${object.color}"></a-sphere>`;
                            default:
                                console.warn(`Unknown object type: ${object.type}`);
                                return '';
                        }
                    }).join('')}
                </a-marker>
                <a-entity camera></a-entity>
            </a-scene>
        </body>
        </html>
    `;
};

const convertSceneToVR = (arObjects) => {
    /**
     * Converts the list of arObjects to the HTML format to be published in VR.
     */
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>VR Environment</title>
            <script src="https://aframe.io/releases/1.6.0/aframe.min.js"></script>
        </head>

        <body style="margin: 0; overflow: hidden;">
            <a-scene>
                ${arObjects.map(object => {
                    switch (object.type) {
                        case "box":
                            return `<a-box position="${object.position.join(" ")}" scale="${object.scale.join(" ")}" color="${object.color}"></a-box>`;
                        case "sphere":
                            return `<a-sphere position="${object.position.join(" ")}" scale="${object.scale.join(" ")}" color="${object.color}"></a-sphere>`;
                        default:
                            console.warn(`Unknown object type: ${object.type}`);
                            return '';
                    }
                }).join('')}
                <a-sky color="#ECECEC"></a-sky>
                <a-camera position="0 0.7 3"></a-camera>
            </a-scene>
        </body>
        </html>
    `;
};

export { convertSceneToAR, convertSceneToVR };