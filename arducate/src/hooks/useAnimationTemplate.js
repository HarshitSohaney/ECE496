import { useAtom } from "jotai";
import { arObjectsAtom } from "../atoms";
import useKeyframe from "./useKeyframe";
import * as THREE from "three";

const useAnimationTemplate = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const { addKeyframe } = useKeyframe();

  const applyTemplate = async (template, objectIds) => {
    switch (template) {
      case "swap":
        return swapAnimation(...objectIds);
      // Add more templates here
      default:
        console.error("Unknown template:", template);
        return false;
    }
  };

  const swapAnimation = async (objectId1, objectId2) => {
    const obj1 = arObjects.find(o => o.id === objectId1);
    const obj2 = arObjects.find(o => o.id === objectId2);
    
    if (!obj1 || !obj2) return false;

    // Store original positions
    const pos1 = [...obj1.position];
    const pos2 = [...obj2.position];

    // Calculate midpoint position
    const midpoint = new THREE.Vector3(
      (pos1[0] + pos2[0]) / 2,
      Math.max(pos1[1], pos2[1]) + 1,
      (pos1[2] + pos2[2]) / 2
    ).toArray();

    // Create keyframe sequences for both objects
    await addKeyframe(objectId1, { time: 0, position: pos1 });
    await addKeyframe(objectId2, { time: 0, position: pos2 });

    await addKeyframe(objectId1, { time: 1, position: midpoint });
    await addKeyframe(objectId2, { time: 1, position: midpoint });

    await addKeyframe(objectId1, { time: 2, position: pos2 });
    await addKeyframe(objectId2, { time: 2, position: pos1 });

    return true;
  };

  return {
    applyTemplate
  };
};

export default useAnimationTemplate;
