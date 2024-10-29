import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom } from "../atoms";
import { Treebeard, decorators } from "react-treebeard";
import { Button } from "../@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

// Custom decorator for tree nodes that includes a visibility toggle
const CustomHeader = ({ node, style, ...props }) => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);

  // Only show visibility toggle for non-folder nodes
  const isObject = !node.children;
  
  const toggleVisibility = (e) => {
    e.stopPropagation(); // Prevent node selection when clicking visibility toggle
    
    if (isObject) {
      const object = arObjects.find(obj => obj.id === node.id);
      if (object) {
        const newVisibility = object.visible === false ? true : false;
        
        // If turning visibility off and this object is selected, clear selection
        if (!newVisibility && selectedObject?.id === object.id) {
          setSelectedObject(null);
        }

        setARObjects({
          type: 'UPDATE_OBJECT',
          payload: {
            ...object,
            visible: newVisibility
          }
        });
      }
    }
  };

  return (
    <div style={style.base} {...props}>
      <div style={style.title}>
        {node.name}
        {isObject && (
          <button
            onClick={toggleVisibility}
            className="ml-2 p-1 hover:bg-gray-200 rounded"
            style={{ float: 'right' }}
          >
            {node.visible === false ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Custom decorators object
const customDecorators = {
  ...decorators,
  Header: CustomHeader
};

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
  }, []);

  const highlightNode = useCallback((node) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    setCursor(node);
  }, [cursor, data, setData]);

  // Update tree data when arObjects change
  useEffect(() => {
    const updateNodeVisibility = (node) => {
      if (!node.children) {
        const object = arObjects.find(obj => obj.id === node.id);
        if (object) {
          node.visible = object.visible;
        }
      } else {
        node.children.forEach(updateNodeVisibility);
      }
    };

    updateNodeVisibility(data);
    setData(Object.assign({}, data));
  }, [arObjects, data, setData]);

  // Synchronize tree selection with the selected object in the canvas
  useEffect(() => {
    if (selectedObject) {
      const matchingNode = findNodeById(data, selectedObject.id);
      if (matchingNode) {
        highlightNode(matchingNode);
      }
    }
  }, [selectedObject, data, findNodeById, highlightNode]);

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
      <Treebeard 
        data={data} 
        onToggle={onToggle} 
        decorators={customDecorators}
      />
    </div>
  );
};

export default SceneGraph;