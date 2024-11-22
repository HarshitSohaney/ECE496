export const generateAnimations = (keyframes) => {
  if (!keyframes || keyframes.length === 0) return "";

  // Memoize radians to degrees conversion
  const radiansToDegrees = (() => {
    const cache = new Map();
    return (rad) => {
      if (!cache.has(rad)) {
        cache.set(rad, rad * (180 / Math.PI));
      }
      return cache.get(rad);
    };
  })();

  // Sort and validate keyframes
  const validKeyframes = keyframes
    .filter(kf => 
      kf.position?.start && 
      kf.position?.end && 
      Array.isArray(kf.position.start) && 
      Array.isArray(kf.position.end)
    )
    .sort((a, b) => a.start - b.start);

  const animations = [];
  let lastEndTime = 0;

  validKeyframes.forEach((kf, index) => {
    // Calculate duration and delay
    const duration = kf.end != null ? (kf.end - kf.start) * 1000 : 0;
    let delay = Math.max(kf.start * 1000, lastEndTime);

    // Ensure scale and rotation have defaults
    const scaleStart = kf.scale?.start || [1, 1, 1];
    const scaleEnd = kf.scale?.end || [1, 1, 1];
    const rotationStart = kf.rotation?.start || [0, 0, 0];
    const rotationEnd = kf.rotation?.end || [0, 0, 0];

    // Generate animations for position, rotation, and scale
    const animationProps = [
      {
        prop: 'position',
        from: kf.position.start.join(' '),
        to: kf.position.end.join(' '),
        defaultFrom: '0 0 0',
        defaultTo: '0 0 0'
      },
      {
        prop: 'rotation',
        from: rotationStart.map(radiansToDegrees).join(' '),
        to: rotationEnd.map(radiansToDegrees).join(' '),
        defaultFrom: '0 0 0',
        defaultTo: '0 0 0'
      },
      {
        prop: 'scale',
        from: scaleStart.join(' '),
        to: scaleEnd.join(' '),
        defaultFrom: '1 1 1',
        defaultTo: '1 1 1'
      }
    ];

    // Create animation strings
    animationProps.forEach(prop => {
      const fromValue = prop.from || prop.defaultFrom;
      const toValue = prop.to || prop.defaultTo;

      if (fromValue && toValue) {
        animations.push(
          `animation__${index}_${prop.prop}= "property: ${prop.prop}; from: ${fromValue}; to: ${toValue}; dur: ${duration}; delay: ${delay}"`
        );
      }
    });

    // Update last end time
    lastEndTime = delay + duration;
  });

  return animations.reverse().join(" ");
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

// Helper function to determine the initial position based on keyframes
export const getInitialPosition = (object) => {
  if (object.keyframes && object.keyframes.length > 0) {
    return object.keyframes[0].position.start; // Use the first keyframe start position
  }
  return object.position; // Fallback to the specified position
};

export const renderObject = (object) => {
  const initialPosition = getInitialPosition(object);
  const animations = generateAnimations(object.keyframes);

  const commonPosition = object.position.join(" ");
  const commonScale = object.scale.join(" ");
  const commonRotation = object.rotation.map(radiansToDegrees).join(" ");
  const commonTextLabel = renderTextLabel(object);

  switch (object.entity) {
    case "a-text":
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

    case "a-element":
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
      <a-entity position="${initialPosition}" ${animations}>
        <${object.entity}
            position="${commonPosition}"
            scale="${commonScale}" 
            rotation="${commonRotation}"
            color="${object.color}">
        </${object.entity}>
        <a-text visible="${object.showLabel}" 
            value="${object.name || `Object ${object.id}`}"
            position="0 ${-object.scale[1]} 0"
            render-order="1"
            scale="0.5 0.5 0.5"
            align="center"
            color="#000000"
            opacity="0.8"
            side="double">
        </a-text>
      </a-entity>`;
  }
};
