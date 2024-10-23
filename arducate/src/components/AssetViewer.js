// src/components/AssetViewer.js
import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, addAssetAtom, selectedObjectAtom } from "../atoms";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../@/components/ui/select";
import { Button } from "../@/components/ui/button";
import { getArAsset } from "./Assets";
import { Treebeard } from "react-treebeard";

const AssetHandler = () => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedValue, setSelectedValue] = useAtom(addAssetAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [data, setData] = useState({
    name: "root",
    toggled: true,
    children: [],
  });
  const [cursor, setCursor] = useState(null);

  // Synchronize tree selection with the selected object in the canvas
  useEffect(() => {
    if (selectedObject) {
      const matchingNode = findNodeById(data, selectedObject.id);
      if (matchingNode) {
        highlightNode(matchingNode);
      }
    }
  }, [selectedObject]);

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const result = findNodeById(child, id);
        if (result) return result;
      }
    }
    return null;
  };

  const highlightNode = (node) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    setCursor(node);
    setData({ ...data }); // Update the tree data to reflect the new active state
  };

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

    // Set the selected object from the tree to the canvas
    const selectedObj = arObjects.find((obj) => obj.id === node.id); // Match by ID or name
    if (selectedObj) {
      setSelectedObject(selectedObj);
    }
  };

  const handleAddObject = (value) => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#bcb9c4",
      type: value,
      entity: getArAsset(value),
      keyframes: [], // Initialize keyframes
    };

    // Update AR Objects
    setARObjects((prev) => {
      const newARObjects = [...prev, newObject];

      // Add file to Treebeard
      const assetCount = newARObjects.filter((obj) => obj.type === value).length;
      const newFile = {
        id: newObject.id, // Use the same ID for object and file
        name: `${value}${assetCount}`,
      };

      if (cursor && cursor.children) {
        cursor.children.push(newFile);
      } else {
        data.children.push(newFile);
      }
      setData(Object.assign({}, data));

      return newARObjects;
    });

    setSelectedValue("");
  };

  const handleAddFolder = () => {
    const newFolder = {
      id: Date.now(),
      name: "New Folder",
      toggled: true,
      children: [],
    };
    if (cursor && cursor.children) {
      cursor.children.push(newFolder);
    } else {
      data.children.push(newFolder);
    }
    setData(Object.assign({}, data));
  };

  return (
    <div className="w-[15vw] items-center p-2 bg-secondary">
      {/* Add Items */}
      <Select value={selectedValue} onValueChange={handleAddObject}>
        <SelectTrigger variant="outline">
          <SelectValue placeholder="Add Asset" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="box">Box</SelectItem>
            <SelectItem value="sphere">Sphere</SelectItem>
            <SelectItem value="cylinder">Cylinder</SelectItem>
            <SelectItem value="plane">Plane</SelectItem>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="cone">Cone</SelectItem>
            <SelectItem value="torus">Torus</SelectItem>
            <SelectItem value="ring">Ring</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Add Action */}
      <Select>
        <SelectTrigger variant="outline" className="mt-1">
          <SelectValue placeholder="Add Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="translate">Translation</SelectItem>
            <SelectItem value="rotate">Rotation</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Add Frame */}
      <Button className="mt-1 bg-input text-black w-full">Add Frame</Button>

      {/* Treebeard Component */}
      <div className="mt-4">
        <Button onClick={handleAddFolder} className="mb-2 w-full">
          Add Folder
        </Button>
        <Treebeard data={data} onToggle={onToggle} />
      </div>
    </div>
  );
};

export default AssetHandler;
