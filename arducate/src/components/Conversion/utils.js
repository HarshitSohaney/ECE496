/**
 * Utility functions for AR object rendering and animation generation
 */

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
export const radiansToDegrees = (radians) => {
  // First normalize the angle to be between -PI and PI
  const normalized = radians % (2 * Math.PI);
  const inRange =
    normalized > Math.PI
      ? normalized - 2 * Math.PI
      : normalized < -Math.PI
      ? normalized + 2 * Math.PI
      : normalized;
  return inRange * (180 / Math.PI);
};

/**
 * Converts RGB array to color string
 * @param {Array} rgb - Array of RGB values [r, g, b] between 0 and 1
 * @returns {string} CSS color string
 */
const rgbArrayToString = (rgb) => {
  if (!Array.isArray(rgb) || rgb.length !== 3) {
    return "#ffffff"; // Default white color
  }
  const [r, g, b] = rgb.map((value) => Math.round(value * 255));
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Generates animation strings for AR objects based on keyframes
 * @param {Array} keyframes - Array of keyframe objects containing position, rotation, and scale
 * @returns {string} Concatenated animation string for A-Frame
 */
export const generateAnimations = (keyframes) => {
  if (!keyframes || keyframes.length < 2)
    return { animations: "", labelAnimations: "" }; // At least 2 keyframes needed

  let animations = [];
  let labelAnimations = [];

  keyframes
    .sort((a, b) => a.time - b.time)
    .forEach((kf, index, array) => {
      if (index === array.length - 1) return;

      const nextKf = array[index + 1];
      const duration = (nextKf.time - kf.time) * 1000;
      const delay = kf.time * 1000;

      const rotation = kf.rotation.map((r) => (Math.abs(r) < 0.0001 ? 0 : r));
      const nextRotation = nextKf.rotation.map((r) =>
        Math.abs(r) < 0.01 ? 0 : r
      );

      const animProps = [
        {
          prop: "position",
          from: kf.position?.join(" ") || "0 0 0",
          to: nextKf.position?.join(" ") || "0 0 0",
        },
        {
          prop: "rotation",
          from: rotation.join(" ") || "0 0 0",
          to: nextRotation.join(" ") || "0 0 0",
        },
        {
          prop: "scale",
          from: kf.scale?.join(" ") || "1 1 1",
          to: nextKf.scale?.join(" ") || "1 1 1",
        },
        {
          prop: "color",
          from: rgbArrayToString(kf.color || [1, 1, 1]),
          to: rgbArrayToString(nextKf.color || [1, 1, 1]),
        },
      ];

      animProps.forEach(({ prop, from, to }) => {
        if (from !== to) {
          const property =
            prop === "color" ? "material.color; type: color" : prop;
          const animString = `animation__${index}_${prop}="property: ${property}; from: ${from}; to: ${to}; dur: ${duration}; delay: ${delay}"`;
          if (prop === "position") {
            labelAnimations.push(animString);
          } 
          animations.push(animString);
        }
      });
    });

  return {
    animations: animations.join(" "),
    labelAnimations: labelAnimations.join(" "),
  };
};

/**
 * Renders a text label for an AR object
 * @param {Object} object - AR object containing position and label information
 * @returns {string} A-Frame text entity markup
 */
export const renderTextLabel = (object, yOffset = -1, animations) => {
  const [_, sy, __] = object.scale;
  const offset = 0.3;
  const localY = yOffset * (sy / 2 + offset);

  return `
    <a-text
      value="${object.label || `Object ${object.id}`}"
      visible="${object.showLabel}"
      position="0 ${localY} 0.05"
      scale="0.5 0.5 0.5"
      align="center"
      color="#000000"
      font="aileronsemibold">
    </a-text>
  `;
};

/**
 * Determines the initial position and color of an AR object based on keyframes
 * @param {Object} object - AR object containing keyframes and position data
 * @returns {Object} Initial position coordinates and color
 */
export const getInitialProperties = (object) => {
  const defaultColor = [1, 1, 1]; // Default white in RGB array format
  if (object.keyframes && object.keyframes.length > 0) {
    return {
      position: object.keyframes[0].position || [0, 0, 0],
      rotation: object.keyframes[0].rotation || [0, 0, 0],
      scale: object.keyframes[0].scale || [1, 1, 1],
      color: rgbArrayToString(object.keyframes[0]?.color) || object.color,
    };
  }
  return {
    position: object.position || [0, 0, 0],
    rotation: object.rotation || [0, 0, 0],
    scale: object.scale || [1, 1, 1],
    color: object.color || rgbArrayToString(defaultColor),
  };
};

/**
 * Renders an AR object with appropriate entity type and attributes
 * @param {Object} object - AR object containing entity type and properties
 * @returns {string} A-Frame entity markup
 */
export const renderObject = (object) => {
  const initialProps = getInitialProperties(object);
  const { animations, labelAnimations } = generateAnimations(object.keyframes);
  const position = object.position.join(" ");
  const scale = object.scale.join(" ");
  const rotation = object.rotation.join(" ");

  function fixLineRotation(rotation) {
    let [x, y, z] = rotation.split(" ").map(Number);
    x = -x;
    return `${x} ${y} ${z}`;
  }

  switch (object.entity) {
    case "a-text":
      return `
        <a-text
          position="${position}"
          scale="${scale}"
          rotation="${rotation}"
          value="${object.text}"
          align="center"
          anchor="center"
          color="${object.color}"
          font="aileronsemibold"
          ${animations}>
        </a-text>
      `;

    case "a-element":
      return `
        <a-entity
          position="${position}"
          scale="${scale}"
          rotation="${fixLineRotation(rotation)}"
          line="color: ${object.color}; lineWidth: 2; start: 0 -1 0; end: 0 1 0"
          ${animations}>
        </a-entity>
      `;

    default:
      const label = renderTextLabel({
        ...object,
      });

      return `
          <a-entity>
            <${object.entity}
              material="color: ${initialProps.color}"
              rotation="${rotation}" 
              scale="${scale}"
              position="${position}"
              ${animations}
              >
            </${object.entity}>
            <a-entity look-at="[camera]" ${labelAnimations}  position="${position}">
             ${label}
            </a-entity>
          </a-entity>
        `;
  }
};
