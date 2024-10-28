// src/components/Assets.js
import { Line } from "@react-three/drei";

// Define your geometry components if not already done
const BoxGeometry = () => <boxGeometry args={[1, 1, 1]} />;
const SphereGeometry = () => <sphereGeometry args={[1, 32, 32]} />;
const CylinderGeometry = () => <cylinderGeometry args={[1, 1, 1]} />;
const PlaneGeometry = () => <planeGeometry args={[1, 1]} />;
const CircleGeometry = () => <circleGeometry args={[1, 32]} />;
const ConeGeometry = () => <coneGeometry args={[1, 2, 32]} />;
const TorusGeometry = () => <torusGeometry args={[1, 0.3, 2, 100]} />;
const RingGeometry = () => <ringGeometry args={[0.3, 1, 32]} />;

// Define the Map for geometry types to JSX elements
const Assets = new Map([
  ['box', <BoxGeometry />],
  ['sphere', <SphereGeometry />],
  ['cylinder', <CylinderGeometry />],
  ['plane', <PlaneGeometry />],
  ['circle', <CircleGeometry />],
  ['cone', <ConeGeometry />],
  ['torus', <TorusGeometry />],
  ['ring', <RingGeometry />],
  ['line', <Line points={[[0, 0, 0], [0, 2, 0]]} lineWidth={2} color="black"/>]
]);

export const getAsset = (itemSelected) => {
    return Assets.get(itemSelected);
};

const AssetsAR = new Map([
    ['box', 'a-box'],
    ['sphere', 'a-sphere'],
    ['cylinder', 'a-cylinder'],
    ['plane',  'a-plane'],
    ['circle', 'a-circle'],
    ['cone', 'a-cone'],
    ['torus', 'a-torus'],
    ['ring', 'a-ring'],
    ['line', 'a-element']
]);

export const getArAsset = (item) => {
    return AssetsAR.get(item);
};