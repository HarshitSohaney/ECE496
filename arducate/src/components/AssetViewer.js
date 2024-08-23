// src/components/AssetViewer.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, addAssetAtom } from "../atoms";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "../@/components/ui/select"
import { Button } from "../@/components/ui/button";

const AssetHandler = () => {
  const [, setARObjects] = useAtom(arObjectsAtom);
  const [selectedValue, setSelectedValue] = useAtom(addAssetAtom);

  const handleAddObject = (value) => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#ffa500",
      type: value,
      entity: "a-" + value
    };
    setARObjects((prev) => [...prev, newObject]);
    setSelectedValue('');
  };

  return (
    <div className="w-[15vw] items-center p-2 bg-secondary">
      <Select
        value={selectedValue}
        onValueChange={handleAddObject}
        >
          <SelectTrigger variant="outline">
            <SelectValue placeholder="Add Asset"/>
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
              {/* <SelectItem value="line">Line</SelectItem> */}
              {/* Plane, Box, Sphere, Circle, Cone, Cylinder, Tube, Torus, Ring, Polyhedron, Line */}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger variant="outline" className="mt-1">
            <SelectValue placeholder="Add Action"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="translate">Translation</SelectItem>
              <SelectItem value="rotate">Rotation</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="mt-1 bg-input text-black w-full">
            Add Frame
        </Button>
    </div>
  );
};

export default AssetHandler;