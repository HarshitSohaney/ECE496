// src/components/AssetHandler.js
import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, addAssetAtom, selectedObjectAtom } from "../atoms";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { getArAsset } from "./Assets";

const AssetHandler = ({ data, setData, cursor, setCursor }) => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedValue, setSelectedValue] = useAtom(addAssetAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);

  const handleAddObject = (value) => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#ffa500",
      type: value,
      entity: getArAsset(value),
      keyframes: [], // Initialize keyframes
      name: `${value}-${
        arObjects.filter((obj) => obj.type === value).length + 1
      }`,
      showLabel: true,
    };

    setARObjects((prev) => {
      const newARObjects = [...prev, newObject];
      const newFile = { id: newObject.id, name: newObject.name };

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

  useEffect(() => {
    // find selected object and update its name
    if (selectedObject) {
      const matchingNode = findNodeById(data, selectedObject.id);
      if (matchingNode) {
        matchingNode.name = selectedObject.name;
        setData(Object.assign({}, data));
      }
    }
  }, [arObjects, selectedObject]);

  return (
    <div>
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
    </div>
  );
};

export default AssetHandler;
