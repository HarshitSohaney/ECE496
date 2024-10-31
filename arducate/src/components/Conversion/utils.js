export const generateAnimations = (keyframes) => {
  if (!keyframes || keyframes.length === 0) return "";

  const sortedKeyframes = [...keyframes].sort((a, b) => a.start - b.start);
  const animations = [];
  let lastEndTime = 0; // Keep track of the last end time

  sortedKeyframes.forEach((kf, index) => {
    if (
      !kf.position?.start ||
      !kf.position.end ||
      !Array.isArray(kf.position.start) ||
      !Array.isArray(kf.position.end)
    ) {
      console.warn(`Keyframe ${kf.id} is missing valid position start/end`);
      return;
    }

    const duration = kf.end != null ? (kf.end - kf.start) * 1000 : 0;
    let delay = kf.start * 1000;

    // Adjust delay to avoid overlap
    if (lastEndTime > delay) {
      delay = lastEndTime; // Start immediately after the last animation ends
    }

    const from = kf.position.start.join(" ");
    const to = kf.position.end.join(" ");

    animations.push(
      `animation__${index}="property: position; from: ${from}; to: ${to}; dur: ${duration}; delay: ${delay}; easing: easeInOutSine"`
    );

    // Update lastEndTime
    lastEndTime = delay + duration; // Set lastEndTime to the end of the current animation
  });

  return animations.join(" ");
};

// Function to convert radians to degrees
export const radiansToDegrees = (radians) => radians * (180 / Math.PI);

// Returns Label for Respective Asset
export const renderTextLabel = (object) => `
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
export const renderObject = (object) => {
  const commonPosition = object.position.join(" ");
  const commonScale = object.scale.join(" ");
  const commonRotation = object.rotation.map(radiansToDegrees).join(" ");
  
  // Generate animations for the object using its keyframes
  const animations = generateAnimations(object.keyframes || []);

  return `
    <a-entity position="${commonPosition}" scale="${commonScale}" rotation="${commonRotation}" ${animations}>
      <${object.entity} 
        scale="${commonScale}"
        rotation="${commonRotation}"
        color="${object.color || "#000000"}">
      </${object.entity}>

      <a-text 
        visible="${object.showLabel || false}" 
        value="${object.name || `Object ${object.id}`}"
        position="0 ${-object.scale[1]} 0"
        scale="0.5 0.5 0.5"
        align="center"
        color="#000000"
        opacity="0.8"
        side="double"
        ${animations}>
      </a-text>
    </a-entity>
  `;
};
