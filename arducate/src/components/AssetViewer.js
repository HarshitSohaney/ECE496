// src/components/AssetViewer.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, addAssetAtom, selectedObjectAtom } from "../atoms";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../@/components/ui/select";
import { Button } from "../@/components/ui/button";
import { getArAsset } from "./Assets";

const AssetViewer = () => {
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);
  const [selectedValue, setSelectedValue] = useAtom(addAssetAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);

  const handleAddObject = (value) => {
    const assetName = `${value}${arObjects.length + 1}`;
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: "#ffa500",
      type: value,
      name: assetName,
      entity: getArAsset(value),
    };
    setARObjects((prev) => [...prev, newObject]);
    setSelectedValue('');
  };

  const handleSelectObject = (object) => {
    setSelectedObject(object);
  };

  return (
    <div className="w-[15vw] p-2 bg-secondary">
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
      <Button className="mt-1 bg-input text-black w-full">
        Add Frame
      </Button>

      {/* Displayed Assets */}
      {arObjects.length > 0 && (
        <div className="mt-4 bg-[#e2e8f0] p-2 rounded overflow-y-auto h-[50vh]">
          <h3 className="text-black mb-2 text-lg font-bold">Displayed Assets</h3>
          {arObjects.map((object) => (
            <div
              key={object.id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                selectedObject?.id === object.id
                  ? 'bg-gray-300'
                  : 'hover:bg-gray-500'
              }`}
              onClick={() => handleSelectObject(object)}
            >
              <span className="text-black">{object.type} -</span>
              <span className={`text-[#334]`}>{object.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetViewer;