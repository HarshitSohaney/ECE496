import { Card, Text } from '@mantine/core';
import { motion } from 'framer-motion';
import { useDrag } from 'react-dnd';
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model, { ModelProps } from './Model';

const ModelPreview: React.FC<ModelProps> = ({
  url,
  scale = 1,
  id,
  position,
  rotation,
}) => {
  return (
    <div style={{ width: '100%', height: '80%' }}>
      <Canvas style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
        <Suspense fallback={null}>
          <ambientLight />
          <OrbitControls enableZoom={false} />
          <Model
            url={url}
            scale={scale}
            id={id}
            position={position}
            rotation={rotation}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

interface Asset extends ModelProps {
  name: string;
}

const AssetCard: React.FC<Asset> = ({
  name,
  url,
  scale = 1,
  id,
  position,
  rotation,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ASSET',
    item: { modelUrl: url, scale },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <Card
        shadow="xs"
        padding="xs"
        radius="md"
        withBorder
        style={{
          width: '100%',
          height: 150,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'grab',
          alignItems: 'center',
        }}
      >
        <ModelPreview
          url={url}
          scale={scale}
          id={id}
          position={position}
          rotation={rotation}
        />
        <Text
          style={{
            color: '#f0f0f0',
            fontSize: '13px',
            textAlign: 'center',
            lineHeight: '1.5',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          {name}
        </Text>
      </Card>
    </motion.div>
  );
};

export default AssetCard;
