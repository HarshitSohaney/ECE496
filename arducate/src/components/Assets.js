// src/components/Assets.js
import { Text } from '@react-three/drei';

// Define your geometry components if not already done
const BoxGeometry = () => <boxGeometry args={[1, 1, 1]} />;
const SphereGeometry = () => <sphereGeometry args={[1, 32, 32]} />;
const CylinderGeometry = () => <cylinderGeometry args={[1, 1, 1]} />;
const PlaneGeometry = () => <planeGeometry args={[1, 1]} />;
const CircleGeometry = () => <circleGeometry args={[1, 32]} />;
const ConeGeometry = () => <coneGeometry args={[1, 2, 32]} />;
const TorusGeometry = () => <torusGeometry args={[1, 0.3, 2, 100]} />;
const RingGeometry = () => <ringGeometry args={[0.3, 1, 32]} />;

const TextAsset = ({text}) => 
    <Text
      color="black"
      anchorX="center"
      anchorY="middle"
      position={[0, 0, 0]}
    >
      {text}
    </Text>;

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
  ['text', (props) => <TextAsset text={props.text} />],
]);

export const getAsset = (itemSelected, props) => {
    const asset = Assets.get(itemSelected);
    // Only pass props if the asset type is 'text'
    return itemSelected === 'text' ? asset(props) : asset; // Call without props for non-text assets
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
    ['text', 'a-text'],
]);

export const getArAsset = (item) => {
    return AssetsAR.get(item);
};