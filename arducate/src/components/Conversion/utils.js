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
// const rgbArrayToString = (rgb) => {
//   if (!Array.isArray(rgb) || rgb.length !== 3) {
//     return "#ffffff"; // Default white color
//   }
//   const [r, g, b] = rgb.map((value) => Math.round(value * 255));
//   return `rgb(${r}, ${g}, ${b})`;
// };

/**
 * Generates animation strings for AR objects based on keyframes
 * @param {Array} keyframes - Array of keyframe objects containing position, rotation, scale, and color data
 * @returns {string} Concatenated animation string for A-Frame
 */
export const generateAnimations = (keyframes) => {
  if (!keyframes || keyframes.length === 0) return "";

  const validKeyframes = keyframes.filter((kf) => {
    return (
      kf.position?.start &&
      kf.position?.end &&
      Array.isArray(kf.position.start) &&
      Array.isArray(kf.position.end)
    );
  });

  return validKeyframes
    .sort((a, b) => a.start - b.start)
    .map((kf, index) => {
      const duration = (kf.end - kf.start) * 1000;
      const delay = kf.start * 1000;

      const animations = [
        {
          prop: "position",
          from: kf.position.start.join(" "),
          to: kf.position.end.join(" "),
        },
        {
          prop: "rotation",
          from: kf.rotation?.start.map(radiansToDegrees).join(" ") || "0 0 0",
          to: kf.rotation?.end.map(radiansToDegrees).join(" ") || "0 0 0",
        },
        {
          prop: "scale",
          from: kf.scale?.start.join(" ") || "1 1 1",
          to: kf.scale?.end.join(" ") || "1 1 1",
        },
        // {
        //   prop: "color",
        //   from: rgbArrayToString(kf.color?.start || [1, 1, 1]),
        //   to: rgbArrayToString(kf.color?.end || [1, 1, 1]),
        // },
      ];

      return animations
        .filter(({ from, to }) => from !== to)
        .map(({ prop, from, to }) => {
          const property =
            prop === "color" ? "material.color; type: color" : prop;
          return `animation__${index}_${prop}="property: ${property}; from: ${from}; to: ${to}; dur: ${duration}; delay: ${delay}"`;
        })
        .join(" ");
    })
    .join(" ");
};

/**
 * Renders a text label for an AR object
 * @param {Object} object - AR object containing position and label information
 * @returns {string} A-Frame text entity markup
 */
export const renderTextLabel = (object) => `
  <a-text 
    visible="${object.showLabel}" 
    value="${object.name || `Object ${object.id}`}"
    position="0 ${-object.scale[1]} 0"
    render-order="2"
    scale="0.5 0.5 0.5"
    align="center"
    color="#000000"
    opacity="0.8"
    side="double">
  </a-text>
`;

/**
 * Determines the initial position and color of an AR object based on keyframes
 * @param {Object} object - AR object containing keyframes and position data
 * @returns {Object} Initial position coordinates and color
 */
export const getInitialProperties = (object) => {
  const defaultColor = [1, 1, 1]; // Default white in RGB array format

  if (object.keyframes && object.keyframes.length > 0) {
    return {
      position: object.keyframes[0].position.start,
      // color: rgbArrayToString(object.keyframes[0].color?.start || defaultColor),
    };
  }
  return {
    position: object.position,
    // color: rgbArrayToString(object.color ? object.color : defaultColor),
  };
};

/**
 * Renders an AR object with appropriate entity type and attributes
 * @param {Object} object - AR object containing entity type and properties
 * @returns {string} A-Frame entity markup
 */
export const renderObject = (object) => {
  const initialProps = getInitialProperties(object);
  const animations = generateAnimations(object.keyframes);

  // Use either keyframe initial position or object position
  const position = initialProps.position.join(" ");
  const scale = object.scale.join(" ");
  const rotation = object.rotation.map(radiansToDegrees).join(" ");

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
          color="${initialProps.color}"
          ${animations}>
        </a-text>
        ${renderTextLabel({ ...object, position: initialProps.position })}
      `;

    case "a-element":
      return `
        <a-entity 
          position="${position}"
          scale="${scale}"
          rotation="${rotation}"
          line="color: ${
            object.color
          }; lineWidth: 2; start: 0 0 0; end: 0 2 0"
          ${animations}>
        </a-entity>
        ${renderTextLabel({ ...object, position: initialProps.position })}
      `;

    default:
      return `
        <${object.entity}
          position="${position}"
          scale="${scale}" 
          rotation="${rotation}"
          color="${object.color}"
          ${animations}>
          <a-text 
            visible="${object.showLabel}" 
            value="${object.name || `Object ${object.id}`}"
            position="0 ${-object.scale[1]} 0"
            render-order="1"
            scale="0.5 0.5 0.5"
            align="center"
            color="#000000"
            opacity="0.8"
            side="double">
          </a-text>
        </${object.entity}>
      `;
  }
};
