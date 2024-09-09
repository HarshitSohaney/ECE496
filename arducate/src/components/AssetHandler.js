// src/components/AssetHandler.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, addAssetAtom } from "../atoms";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../@/components/ui/select";
import { getArAsset } from "./Assets";

const AssetHandler = ({ data, setData, cursor, setCursor }) => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedValue, setSelectedValue] = useAtom(addAssetAtom);

  const handleAddObject = (value) => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#ffa500",
      type: value,
      entity: getArAsset(value),
    };

    setARObjects((prev) => {
      const newARObjects = [...prev, newObject];
      const assetCount = newARObjects.filter((obj) => obj.type === value).length;
      const newFile = { id: newObject.id, name: `${value}${assetCount}` };

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
