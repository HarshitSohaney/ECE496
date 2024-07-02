import React, { useEffect } from 'react';
import { useControls, LevaPanel } from 'leva';

interface ControlPanelProps {
  selectedModel: {
    id: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
  };
  updateModelPosition: (position: [number, number, number]) => void;
  updateModelRotation: (rotation: [number, number, number]) => void;
  updateModelScale: (scale: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedModel,
  updateModelPosition,
  updateModelRotation,
  updateModelScale,
}) => {
  const { position, rotation, scale } = useControls(
    `Model ${selectedModel.id}`,
    {
      position: {
        value: selectedModel.position,
        step: 0.1,
        lock: true,
        label: 'Position',
      },
      rotation: {
        value: selectedModel.rotation,
        step: 0.1,
        lock: true,
        label: 'Rotation',
      },
      scale: {
        value: selectedModel.scale,
        step: 0.1,
        label: 'Scale',
      },
    }
  );

  useEffect(() => {
    updateModelPosition(position);
  }, [position, updateModelPosition]);

  useEffect(() => {
    updateModelRotation(rotation);
  }, [rotation, updateModelRotation]);

  useEffect(() => {
    updateModelScale(scale);
  }, [scale, updateModelScale]);

  return <LevaPanel fill />;
};

export default ControlPanel;
