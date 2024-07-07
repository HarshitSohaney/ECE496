import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, OrbitControls, Grid } from '@react-three/drei';
import { useDrop } from 'react-dnd';
import Model, { ModelProps } from './Model';
import ControlPanel from './ControlPanel';
import SceneData from './ARScene';

const SceneEditor: React.FC = () => {
  const [models, setModels] = useState<ModelProps[]>([]);

  const [{ isOver }, drop] = useDrop({
    accept: 'ASSET',
    drop: (item: { modelUrl: string; scale: number }) => {
      const newModel: ModelProps = {
        url: item.modelUrl,
        scale: item.scale,
        position: [Math.random() * 2 - 1, 0, Math.random() * 2 - 1], // Random position for demonstration
        rotation: [0, 0, 0],
        id: `${item.modelUrl}-${Date.now()}`, // Ensure unique ID
      };
      setModels((currentModels) => [...currentModels, newModel]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    console.log('Current models:', models);
  }, [models]);

  const updateModelPosition = useCallback(
    (id: string, position: [number, number, number]) => {
      setModels((currentModels) =>
        currentModels.map((model) =>
          model.id === id ? { ...model, position } : model
        )
      );
    },
    []
  );

  const updateModelRotation = useCallback(
    (id: string, rotation: [number, number, number]) => {
      setModels((currentModels) =>
        currentModels.map((model) =>
          model.id === id ? { ...model, rotation } : model
        )
      );
    },
    []
  );

  const updateModelScale = useCallback((id: string, scale: number) => {
    setModels((currentModels) =>
      currentModels.map((model) =>
        model.id === id ? { ...model, scale } : model
      )
    );
  }, []);

  const handlePublish = () => {
    const sceneData = JSON.stringify(models);
    localStorage.setItem('sceneData', sceneData);
    window.open('/aframe.html', '_blank');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        ref={drop}
        style={{
          flex: 1,
          backgroundColor: isOver ? 'lightblue' : 'white',
        }}
      >
        <Canvas style={{ width: '100%', height: '100%' }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <Grid
            args={[10, 10]} // size of the grid
            position={[0, -0.5, 0]} // position of the grid
            rotation={[Math.PI / 2, 0, 0]} // rotate the grid to be on the ground
            infiniteGrid={true} // make the grid infinite
          />
          {models.map((model) => (
            <Model
              key={model.id}
              id={model.id}
              url={model.url}
              scale={model.scale}
              position={model.position}
              rotation={model.rotation}
            />
          ))}
          {/* <Stats /> */}
        </Canvas>
      </div>
      {models.map((model) => (
        <ControlPanel
          key={model.id}
          selectedModel={model}
          updateModelPosition={(position) =>
            updateModelPosition(model.id, position)
          }
          updateModelRotation={(rotation) =>
            updateModelRotation(model.id, rotation)
          }
          updateModelScale={(scale) => updateModelScale(model.id, scale)}
        />
      ))}
      <button onClick={handlePublish} style={{ position: 'absolute', top: '10px', right: '10px', background: '#0677c5' }}>
        Publish
      </button>
    </div>
  );
};

export default SceneEditor;
