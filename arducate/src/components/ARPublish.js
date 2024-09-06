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
            <script type="text/javascript">
                AFRAME.registerComponent('drag-rotate-component',{
                schema : { speed : { default: 1 } },
                init : function(){
                    this.ifMouseDown = false;
                    this.x_cord = 0;
                    this.y_cord = 0;
                    document.addEventListener('mousedown',this.OnDocumentMouseDown.bind(this));
                    document.addEventListener('mouseup',this.OnDocumentMouseUp.bind(this));
                    document.addEventListener('mousemove',this.OnDocumentMouseMove.bind(this));
                },
                OnDocumentMouseDown : function(event){
                    this.ifMouseDown = true;
                    this.x_cord = event.clientX;
                    this.y_cord = event.clientY;
                },
                OnDocumentMouseUp : function(){
                    this.ifMouseDown = false;
                },
                OnDocumentMouseMove : function(event)
                {
                    if(this.ifMouseDown)
                    {
                    var temp_x = event.clientX-this.x_cord;
                    var temp_y = event.clientY-this.y_cord;
                    if(Math.abs(temp_y)<Math.abs(temp_x))
                    {
                        this.el.object3D.rotateY(temp_x*this.data.speed/1000);
                    }
                    else
                    {
                        this.el.object3D.rotateX(temp_y*this.data.speed/1000);
                    }
                    this.x_cord = event.clientX;
                    this.y_cord = event.clientY;
                    }
                }
                });
            </script>
            <a-scene>
                ${arObjects.map(object => {
                    return `
                        <${object.entity} position="${object.position.join(" ")}" 
                        scale="${object.scale.join(" ")}" rotation="${object.rotation.join(" ")}" 
                        color="${object.color}" drag-rotate-component></${object.entity} >`;
                }).join('')}
                <a-sky color="#ECECEC"></a-sky>
                <a-camera position="0 0 4" look-controls="enabled:false"></a-camera>
            </a-scene>
        </body>
        </html>
    `
};

export { convertSceneToAR, convertSceneToVR };