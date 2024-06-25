// src/components/DraggableItem.tsx
import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';

interface DraggableItemProps {
  id: number;
  image: string;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, image, onSelect, isSelected }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { id },
  }));

  return (
    <div
      ref={drag}
      onClick={() => onSelect(id)}
      style={{
        border: isSelected ? '2px solid blue' : '2px solid transparent',
        padding: '10px',
        margin: '10px',
        cursor: 'move',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <img src={image} alt={`Item ${id}`} width="100%" height="auto" />
    </div>
  );
};

export default DraggableItem;
