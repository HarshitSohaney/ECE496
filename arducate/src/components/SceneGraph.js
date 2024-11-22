// src/components/SceneGraph.js
import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom } from "../atoms";
import { Treebeard } from "react-treebeard";
import { Button } from "../@/components/ui/button";

const SceneGraph = ({ data, setData }) => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [cursor, setCursor] = useState(null);

  const findNodeById = useCallback((node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const result = findNodeById(child, id);
        if (result) return result;
      }
    }
    return null;
  },[]);

  const highlightNode = useCallback((node) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    setCursor(node);
  },[cursor,data,setData]);

  // Synchronize tree selection with the selected object in the canvas
  useEffect(() => {
    if (selectedObject) {
      const matchingNode = findNodeById(data, selectedObject.id);
      if (matchingNode) {
        highlightNode(matchingNode);
      }
    }
  }, [selectedObject, data]);
  
  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));

    const selectedObj = arObjects.find((obj) => obj.id === node.id);
    if (selectedObj) {
      setSelectedObject(selectedObj);
    }
  };

  const handleAddFolder = () => {
    const newFolder = { id: Date.now(), name: "New Folder", toggled: true, children: [] };
    if (cursor && cursor.children) {
      cursor.children.push(newFolder);
    } else {
      data.children.push(newFolder);
    }
    setData(Object.assign({}, data));
  };

  return (
    <div className="mt-4">
      <Button onClick={handleAddFolder} className="mb-2 w-full">
        Add Folder
      </Button>
      <Treebeard data={data} onToggle={onToggle} />
    </div>
  );
};

export default SceneGraph;