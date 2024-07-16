import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-inspector';

// Custom A-Frame Component for the plugin
AFRAME.registerComponent('custom-inspector-plugin', {
  init: function () {
    // Access the A-Frame Inspector
    const inspector = AFRAME.INSPECTOR;

    // Example: Add a custom button to the inspector
    if (inspector) {
      inspector.on('inspector-loaded', () => {
        const button = document.createElement('button');
        button.textContent = 'Custom Button';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.onclick = () => {
          alert('Custom button clicked!');
        };
        inspector.container.appendChild(button);
      });
    }
  },
});

// React component to initialize the A-Frame scene with the custom plugin
const CustomInspectorPlugin = () => {
  useEffect(() => {
    // Initialize the custom inspector plugin component
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.setAttribute('custom-inspector-plugin', '');
    }
  }, []);

  return (
    <a-scene inspector="url: /path/to/aframe-inspector.js">
      <a-box position="0 1 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere position="2 1 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder position="-1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  );
};

export default CustomInspectorPlugin;
