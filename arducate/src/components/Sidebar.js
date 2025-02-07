// src/components/Sidebar.js
import React, { useState, useCallback } from "react";
import SceneGraph from "./SceneGraph";
import { Group, Move, MoveDiagonal, RotateCw } from "lucide-react";
import AssetHandler from "./AssetHandler";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Button } from "../@/components/ui/button";
import { useAtom } from "jotai";
import { treeDataAtom, selectedObjectsAtom, groupsAtom } from "../atoms";
import { transformModeAtom } from "../atoms";
import * as THREE from "three";

const Sidebar = () => {
  const [data, setData] = useAtom(treeDataAtom);
  const [, setGroups] = useAtom(groupsAtom);
  const [selectedObjects] = useAtom(selectedObjectsAtom);
  const [cursor, setCursor] = useState(null);
  const [, setTransformMode] = useAtom(transformModeAtom);

  const handleGroupCreate = () => {
    if (selectedObjects.length < 2) return;

    const threeGroup = new THREE.Group();
    const groupId = Date.now();

    setGroups({
      type: 'CREATE_GROUP',
      payload: {
        id: groupId,
        objectIds: selectedObjects.map(obj => obj.id),
        threeGroup
      }
    });
  };

  return (
    <div className="w-[15vw] items-center p-2 bg-secondary flex flex-col space-y-2 overflow-y-auto">
      <div className="navbar-button-container flex flex-row space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="navbar-button"
          onClick={() => setTransformMode("translate")}
        >
          <Move />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="navbar-button"
          onClick={() => setTransformMode("scale")}
        >
          <MoveDiagonal />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="navbar-button"
          onClick={() => setTransformMode("rotate")}
        >
          <RotateCw />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="navbar-button"
          onClick={handleGroupCreate}
          disabled={selectedObjects.length < 2}
        >
          <Group className="h-4 w-4"/>
        </Button>
      </div>

      <SceneGraph data={data} setData={setData} />
    </div>
  );
};

export default Sidebar;
