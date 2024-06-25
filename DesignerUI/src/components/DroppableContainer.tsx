// src/components/DroppableContainer.tsx
import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface DroppableContainerProps {
  onDrop: (id: number) => void;
  children?: ReactNode;
}

const DroppableContainer: React.FC<DroppableContainerProps> = ({ onDrop, children }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.COMPONENT,
    drop: (item: { id: number }) => {
      onDrop(item.id);
    },
  }));

  return (
    <div ref={drop} style={{ minHeight: '400px', border: '2px dashed gray', padding: '10px' }}>
      {children}
    </div>
  );
};

export default DroppableContainer;