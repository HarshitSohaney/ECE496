import React from 'react';
import { SimpleGrid } from '@mantine/core';
import AssetCard from './AssetCard';
import { ModelProps } from './Model';

const assets: Array<ModelProps & { name: string }> = [
  {
    name: 'Box',
    id: 'lol1',
    url: '/models/Box.gltf',
    scale: 2.5,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  //   { name: 'Asset 2', url: '/models/Fox.glb', scale: 0.03 },
  //   { name: 'Asset 3', url: '/path/to/asset3.gltf', scale: 0.75 },
];

const AssetLibrary: React.FC = () => {
  return (
    <SimpleGrid cols={2} spacing="sm">
      {assets.map((asset, index) => (
        <AssetCard
          key={index}
          name={asset.name}
          id={asset.id}
          url={asset.url}
          scale={asset.scale}
          position={asset.position}
          rotation={asset.rotation}
        />
      ))}
    </SimpleGrid>
  );
};

export default AssetLibrary;
