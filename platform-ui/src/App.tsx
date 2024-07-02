import React from 'react';
import { AppShell, MantineProvider } from '@mantine/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SceneEditor from './components/SceneEditor';
import { NavbarMinimal } from './components/Navbar';
import '@mantine/core/styles.css';

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider defaultColorScheme="dark">
        <AppShell padding="md">
          <AppShell.Navbar>
            <NavbarMinimal />
          </AppShell.Navbar>
          <AppShell.Main style={{ flex: 1, padding: 0, height: '100vh' }}>
            <SceneEditor />
          </AppShell.Main>
        </AppShell>
      </MantineProvider>
    </DndProvider>
  );
};

export default App;
