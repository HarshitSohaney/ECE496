import { useAtom } from "jotai";
import { arObjectsAtom, currentTimeAtom } from "../atoms";
import useKeyframe from "./useKeyframe";
import * as THREE from "three";

const useAnimationTemplate = () => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const { addKeyframe } = useKeyframe();
  const [currentTime] = useAtom(currentTimeAtom);

  const applyTemplate = async (template, objectIds) => {
    switch (template) {
      case "swap":
        return swapAnimation(...objectIds);
      case "circle":
        console.log(objectIds, ...objectIds);
        return circleAnimation(objectIds);
      case "connect":
        return connectObjects(objectIds);
      default:
        console.error("Unknown template:", template);
        return false;
    }
  };

  const swapAnimation = async (objectId1, objectId2) => {
    // Before we start, ensure both objects exist
    const obj1 = arObjects.find((o) => o.id === objectId1);
    const obj2 = arObjects.find((o) => o.id === objectId2);

    if (!obj1 || !obj2) return false;

    // Get keyframes for both objects
    const keyframes1 = obj1.keyframes || [];
    const keyframes2 = obj2.keyframes || [];

    // Check if there is a 2-second window where neither object's position changes
    const hasConflict = (keyframes, currentPosition) => {
      return keyframes.some((kf) => {
        const timeDiff = Math.abs(kf.time - currentTime);
        return timeDiff <= 2 && kf.position[0] !== currentPosition[0];
      });
    };

    const conflict1 = hasConflict(keyframes1, obj1.position);
    const conflict2 = hasConflict(keyframes2, obj2.position);

    if (conflict1 || conflict2) {
      console.warn(
        "Playhead is in the middle of another animation. Aborting swap animation."
      );
      return false;
    }

    // Store original positions
    const pos1 = [...obj1.position];
    const pos2 = [...obj2.position];

    // Calculate midpoint position
    const midpoint = new THREE.Vector3(
      (pos1[0] + pos2[0]) / 2,
      Math.max(pos1[1], pos2[1]) + 1,
      (pos1[2] + pos2[2]) / 2
    ).toArray();

    console.log("Starting swap animation creation...");
    const startTime = currentTime;

    // Create keyframe sequences for both objects
    // Initial positions
    console.log("Adding initial keyframes at t=0");
    await addKeyframe(objectId1, { time: startTime, position: pos1 });
    await addKeyframe(objectId2, { time: startTime, position: pos2 });

    // Midpoint positions
    console.log("Adding midpoint keyframes at t=1");
    await addKeyframe(objectId1, { time: startTime + 1, position: midpoint });
    await addKeyframe(objectId2, { time: startTime + 1, position: -midpoint });

    // Final positions
    console.log("Adding final keyframes at t=2");
    await addKeyframe(objectId1, { time: startTime + 2, position: pos2 });
    await addKeyframe(objectId2, { time: startTime + 2, position: pos1 });

    console.log("Swap animation creation complete!");
    return true;
  };

  // this template allows the user to move multiple objects in a circle
  // around the middle point (for simplicity we'll  do 1 full circular rotation)
  const circleAnimation = async (objectIds, options = {}) => {
    // Default options
    let rotationPlane = options.rotationPlane || "xy"; // Options: 'xy', 'yz', 'xz'
    let duration = options.duration || 5; // Duration of the animation in seconds
    let radius = options.radius || null; // If null, will be calculated based on object spread

    // Find the mean position of all selected objects
    let centerObjects = objectIds
      .map((id) => arObjects.find((o) => o.id === id))
      .filter(Boolean);

    if (centerObjects.length === 0) {
      console.error("No valid objects found");
      return false;
    }

    // Calculate mean position
    let meanPosition = centerObjects
      .reduce(
        (acc, obj) => {
          return [
            acc[0] + obj.position[0],
            acc[1] + obj.position[1],
            acc[2] + obj.position[2],
          ];
        },
        [0, 0, 0]
      )
      .map((coord) => coord / centerObjects.length);

    // Calculate radius if not provided
    if (radius === null) {
      let distances = centerObjects.map((obj) =>
        Math.sqrt(
          Math.pow(obj.position[0] - meanPosition[0], 2) +
            Math.pow(obj.position[1] - meanPosition[1], 2) +
            Math.pow(obj.position[2] - meanPosition[2], 2)
        )
      );
      radius = Math.max(...distances) * 1.5; // Give some extra space
    }

    // Create animation for each object
    for (let i = 0; i < objectIds.length; i++) {
      let objectId = objectIds[i];
      let startObject = arObjects.find((o) => o.id === objectId);
      if (!startObject) continue;

      // Calculate initial position relative to mean
      let initialOffset = [
        startObject.position[0] - meanPosition[0],
        startObject.position[1] - meanPosition[1],
        startObject.position[2] - meanPosition[2],
      ];

      // Create keyframes for a full revolution
      for (let t = 0; t <= duration; t += duration / 4) {
        // Calculate current angle
        let currentAngle = (t / duration) * Math.PI * 2;

        // Rotation matrix based on the plane
        let rotatedOffset;
        switch (rotationPlane) {
          case "xy":
            rotatedOffset = [
              initialOffset[0] * Math.cos(currentAngle) -
                initialOffset[1] * Math.sin(currentAngle),
              initialOffset[0] * Math.sin(currentAngle) +
                initialOffset[1] * Math.cos(currentAngle),
              initialOffset[2],
            ];
            break;
          case "yz":
            rotatedOffset = [
              initialOffset[0],
              initialOffset[1] * Math.cos(currentAngle) -
                initialOffset[2] * Math.sin(currentAngle),
              initialOffset[1] * Math.sin(currentAngle) +
                initialOffset[2] * Math.cos(currentAngle),
            ];
            break;
          case "xz":
            rotatedOffset = [
              initialOffset[0] * Math.cos(currentAngle) -
                initialOffset[2] * Math.sin(currentAngle),
              initialOffset[1],
              initialOffset[0] * Math.sin(currentAngle) +
                initialOffset[2] * Math.cos(currentAngle),
            ];
            break;
          default:
            console.error("Invalid rotation plane");
            return false;
        }

        // Calculate new position by adding rotated offset to mean position
        let newPosition = [
          meanPosition[0] + rotatedOffset[0],
          meanPosition[1] + rotatedOffset[1],
          meanPosition[2] + rotatedOffset[2],
        ];

        await addKeyframe(objectId, {
          time: t,
          position: newPosition,
        });
      }
    }

    console.log(
      `Circle revolution (${rotationPlane} plane) creation complete!`
    );
    return true;
  };

  // this next template just simply creates a line (or lines) that connect the two selected
  // objects - it should orient itself correctly (slanted and rotated the right way)
  const connectObjects = async (objectIds, options = {}) => {
    let color = options.color || "#888888";

    if (objectIds.length < 2) {
      console.error("Need at least two objects to connect");
      return false;
    }

    let connectedObjects = objectIds
      .map((id) => arObjects.find((o) => o.id === id))
      .filter(Boolean);

    if (connectedObjects.length < 2) {
      console.error("Could not find valid objects to connect");
      return false;
    }

    let startObj = connectedObjects[0];
    let endObj = connectedObjects[connectedObjects.length - 1];

    let startPos = new THREE.Vector3(...startObj.position);
    let endPos = new THREE.Vector3(...endObj.position);

    let direction = new THREE.Vector3().subVectors(endPos, startPos);
    let length = direction.length();
    let midpoint = startPos.clone().addScaledVector(direction, 0.5);

    let rotationMatrix = new THREE.Matrix4();
    rotationMatrix.lookAt(startPos, endPos, new THREE.Vector3(0, 1, 0));
    let quaternion = new THREE.Quaternion().setFromRotationMatrix(
      rotationMatrix
    );
    let eulerRotation = new THREE.Euler().setFromQuaternion(quaternion);

    const connectionObject = {
      id: `connection-${Date.now()}`,
      name: `Connection-${startObj.name}-${endObj.name}`,
      type: "cylinder",
      position: midpoint.toArray(),
      rotation: eulerRotation.toArray(),
      color: color,
      scale: [0.2, length, 0.2], // Adjust cylinder dimensions
    };

    setARObjects({ type: "ADD_OBJECT", payload: connectionObject });

    return true;
  };
  return {
    applyTemplate,
  };
};

export default useAnimationTemplate;
