// src/App.tsx
import React, { useState } from 'react';
import DraggableItem from './components/DraggableItem';
import DroppableContainer from './components/DroppableContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import cubeImage from './assets/cube.png'; // Import the local image
import cylinderImage from './assets/cylinder.png'; // Import the local image
import circleImage from './assets/circle.png'; // Import the local image

const App: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [items, setItems] = useState([
    { id: 1, image: cubeImage },
    { id: 2, image: cylinderImage },
    { id: 3, image: circleImage },
  ]);

  const [droppedItems, setDroppedItems] = useState<{ id: number; image: string }[]>([]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleDrop = (id: number) => {
    const item = items.find((item) => item.id === id);
    if (item) {
      setDroppedItems((prev) => [...prev, item]);
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', padding: '0 20px' }}>
        <div style={{ width: '50%', borderRight: '1px solid gray', display: 'flex', flexWrap: 'wrap' }}>
          {items.map((item) => (
            <div key={item.id} style={{ width: 'calc(50% - 20px)', margin: '10px' }}>
              <DraggableItem
                id={item.id}
                image={item.image}
                onSelect={handleSelect}
                isSelected={selectedId === item.id}
              />
            </div>
          ))}
        </div>
        <div style={{ width: '50%', padding: '10px' }}>
          <DroppableContainer onDrop={handleDrop}>
            {droppedItems.map((item) => (
              <div key={item.id} style={{ padding: '10px' }}>
                <img src={item.image} alt={`Dropped ${item.id}`} width={100} height={100} />
              </div>
            ))}
          </DroppableContainer>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
