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
        </head>

        <body style="margin: 0; overflow: hidden;">
            <a-scene embedded arjs renderer="logarithmicDepthBuffer: true;" vr-mode-ui="enabled: false" gesture-detector>
                <a-marker preset="hiro">
                    ${arObjects.map(object => {
                        return `
                        <${object.entity} position="${object.position.join(" ")}" 
                        scale="${object.scale.join(" ")}" rotation="${object.rotation.join(" ")}" 
                        color="${object.color}"></${object.entity}>`;
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
     * 
     * Referenced code from: https://stackoverflow.com/questions/42041517/how-do-i-rotate-a-box-in-a-frame-by-moving-or-dragging-the-mouse
     */
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
                ${arObjects.map(object => {
                    return `
                        <${object.entity} position="${object.position.join(" ")}" 
                        scale="${object.scale.join(" ")}" rotation="${object.rotation.join(" ")}" 
                        color="${object.color}"></${object.entity} >`;
                }).join('')}
                <a-sky color="#ECECEC"></a-sky>
                <a-camera position="0 0 4" look-controls="enabled:true"></a-camera>
            </a-scene>
            
        </body>
        </html>
    `
};

export { convertSceneToAR, convertSceneToVR };