// src/components/Assets.js
import { Text } from '@react-three/drei';
import { Line } from "@react-three/drei";
import { Arrow } from '../models/arrow';

// Define your geometry components if not already done
const BoxGeometry = () => <boxGeometry args={[1, 1, 1]} />;
const SphereGeometry = () => <sphereGeometry args={[1, 32, 32]} />;
const CylinderGeometry = () => <cylinderGeometry args={[1, 1, 1]} />;
const PlaneGeometry = () => <planeGeometry args={[1, 1]} />;
const CircleGeometry = () => <circleGeometry args={[1, 32]} />;
const ConeGeometry = () => <coneGeometry args={[1, 2, 32]} />;
const TorusGeometry = () => <torusGeometry args={[1, 0.3, 2, 100]} />;
const RingGeometry = () => <ringGeometry args={[0.3, 1, 32]} />;

const TextAsset = ({text, color}) => 
    <Text
      color={color}
      anchorX="center"
      anchorY="middle"
      position={[0, 0, 0]}
    >
      {text}
    </Text>;

  const LineAsset = ({color}) => {
    return <Line points={[[0, -1, 0], [0, 1, 0]]} lineWidth={2} color={color} />;
  };

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
  ['text', (props) => <TextAsset text={props.text} color={props.color} />],
  ['line', (props) => <LineAsset color={props.color} />],
  ['arrow', <Arrow />]
]);

export const getAsset = (itemSelected, props) => {
    const asset = Assets.get(itemSelected);
    // Only pass props if the asset type is 'text' or 'line'
    if (itemSelected === 'text' || itemSelected === 'line') {
      return asset(props);
    }
    
    return asset;
    
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
    ['line', 'a-element'],
    ['arrow', 'a-gltf-model src="https://mixiplycontent.blob.core.windows.net/usefulstuff/b886ee02-15e0-451a-c594-08d6d1d77884/arrow.gltf"']
]);

export const getArAsset = (item) => {
    return AssetsAR.get(item);
};