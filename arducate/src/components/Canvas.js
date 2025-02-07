import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Grid,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { useAtom } from "jotai";
import {
  arObjectsAtom,
  selectedObjectsAtom,
  groupsAtom,
  transformModeAtom,
  transformControlsRefAtom,
} from "../atoms";
import ARObject from "./ARObject";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SceneContents = ({
  selectedObjects,
  arObjects,
  groups,
  transformControlsRef,
  handleObjectTransform,
  setSelectedObjects,
  setTransformControlsRef,
  transformMode,
}) => {
  const { gl, camera } = useThree();
  const labelRendererRef = useRef(new CSS2DRenderer());
  const dragControlsRef = useRef(null);

  // Filter out objects with null meshRefs
  const validSelectedObjects = selectedObjects.filter(
    (obj) => obj.meshRef?.current != null
  );

  // Setup CSS2DRenderer
  useEffect(() => {
    const renderer = labelRendererRef.current;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.pointerEvents = "none";
    document.body.appendChild(renderer.domElement);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderer.domElement.remove();
      renderer.dispose();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useFrame(({ scene, camera }) => {
    labelRendererRef.current.render(scene, camera);
  });

  // Only create DragControls when there are valid selected objects
  useEffect(() => {
    if (validSelectedObjects.length > 0 && gl && camera) {
      const meshes = validSelectedObjects
        .map((obj) => obj.meshRef?.current)
        .filter(Boolean);

      const controls = new DragControls(meshes, camera, gl.domElement);
      dragControlsRef.current = controls;

      controls.addEventListener("drag", (e) => {
        validSelectedObjects.forEach((obj) => {
          if (obj.meshRef?.current) {
            obj.meshRef.current.position.copy(e.target.position);
          }
        });
      });

      return () => {
        controls.dispose();
        dragControlsRef.current = null;
      };
    }
  }, [validSelectedObjects, camera, gl]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Grid
        args={[10.5, 10.5]}
        cellSize={0.6}
        cellThickness={1}
        cellColor="#6f6f6f"
        sectionSize={3.3}
        sectionThickness={1.5}
        sectionColor="#9d4b4b"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Render grouped objects */}
      {groups.map((group) => (
        <group
          key={group.id}
          ref={(ref) => {
            if (ref) {
              group.threeGroup = ref;
              if (transformControlsRef === group.threeGroup) {
                setTransformControlsRef(ref);
              }
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedObjects([group]);
            setTransformControlsRef(group.threeGroup);
          }}
        >
          {group.objectIds.map((objId) => {
            const object = arObjects.find((obj) => obj.id === objId);
            return object ? (
              <ARObject
                key={object.id}
                object={object}
                isSelected={selectedObjects.some((obj) => obj.id === object.id)}
                setTransformControlsRef={setTransformControlsRef}
                isInGroup={true}
              />
            ) : null;
          })}
        </group>
      ))}

      {/* Render ungrouped objects */}
      {arObjects
        .filter(
          (obj) => !groups.some((group) => group.objectIds.includes(obj.id))
        )
        .map((object) => (
          <ARObject
            key={object.id}
            object={object}
            isSelected={selectedObjects.some((obj) => obj.id === object.id)}
            setTransformControlsRef={setTransformControlsRef}
            isInGroup={false}
          />
        ))}

      {transformControlsRef && (
        <TransformControls
          object={transformControlsRef}
          mode={transformMode}
          onMouseUp={handleObjectTransform}
          onDragging={(e) => e.stopPropagation()}
        />
      )}

      <OrbitControls makeDefault />
    </>
  );
};

const ARCanvas = () => {
  const [selectedObjects, setSelectedObjects] = useAtom(selectedObjectsAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [transformMode] = useAtom(transformModeAtom);
  const [transformControlsRef, setTransformControlsRef] = useAtom(
    transformControlsRefAtom
  );

  const handleGroupCreate = useCallback(() => {
    if (selectedObjects.length < 2) return;

    const validObjects = selectedObjects.filter((obj) => obj.meshRef?.current);
    if (validObjects.length < 2) return;

    const positions = validObjects
      .map((obj) => obj.meshRef.current.position)
      .filter(Boolean);

    const centerPosition = positions
      .reduce((acc, pos) => {
        acc.add(pos);
        return acc;
      }, new THREE.Vector3())
      .divideScalar(positions.length);

    const group = new THREE.Group();
    group.position.copy(centerPosition);

    validObjects.forEach((obj) => {
      if (obj.meshRef.current) {
        const relativePos = obj.meshRef.current.position
          .clone()
          .sub(centerPosition);
        obj.meshRef.current.position.copy(relativePos);
        group.add(obj.meshRef.current);
      }
    });

    setGroups({
      type: "CREATE_GROUP",
      payload: {
        objectIds: validObjects.map((obj) => obj.id),
        threeGroup: group,
      },
    });

    setTransformControlsRef(group);
  }, [selectedObjects, setGroups, setTransformControlsRef]);

  const handleObjectTransform = useCallback(() => {
    if (!transformControlsRef) return;

    const group = groups.find((g) => g.threeGroup === transformControlsRef);
    if (group) {
      const groupMatrix = new THREE.Matrix4();
      transformControlsRef.updateWorldMatrix(true, false);
      groupMatrix.copy(transformControlsRef.matrixWorld);

      group.objectIds.forEach((objectId) => {
        const object = arObjects.find((obj) => obj.id === objectId);
        if (object?.meshRef?.current) {
          const worldPosition = new THREE.Vector3();
          const worldQuaternion = new THREE.Quaternion();
          const worldScale = new THREE.Vector3();

          object.meshRef.current.updateWorldMatrix(true, false);
          object.meshRef.current.matrixWorld.decompose(
            worldPosition,
            worldQuaternion,
            worldScale
          );

          setARObjects({
            type: "UPDATE_OBJECT",
            payload: {
              id: objectId,
              position: worldPosition.toArray(),
              rotation: new THREE.Euler()
                .setFromQuaternion(worldQuaternion)
                .toArray(),
              scale: worldScale.toArray(),
            },
          });
        }
      });
    } else {
      selectedObjects.forEach((object) => {
        if (object.meshRef?.current) {
          setARObjects({
            type: "UPDATE_OBJECT",
            payload: {
              id: object.id,
              position: object.meshRef.current.position.toArray(),
              rotation: object.meshRef.current.rotation.toArray(),
              scale: object.meshRef.current.scale.toArray(),
            },
          });
        }
      });
    }
  }, [transformControlsRef, groups, arObjects, selectedObjects, setARObjects]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "g" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleGroupCreate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleGroupCreate]);

  return (
    <div className="w-[70vw] border border-gray-300">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <SceneContents
          selectedObjects={selectedObjects}
          arObjects={arObjects}
          groups={groups}
          transformControlsRef={transformControlsRef}
          handleObjectTransform={handleObjectTransform}
          setSelectedObjects={setSelectedObjects}
          setTransformControlsRef={setTransformControlsRef}
          transformMode={transformMode}
        />
      </Canvas>
    </div>
  );
};

export default ARCanvas;
