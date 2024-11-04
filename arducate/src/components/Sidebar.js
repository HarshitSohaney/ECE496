// src/components/Sidebar.js
import React, { useState } from "react";
import SceneGraph from "./SceneGraph";
import AssetHandler from "./AssetHandler";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../@/components/ui/select";
import { Button } from "../@/components/ui/button";
import { useAtom } from "jotai";
import { treeDataAtom } from "../atoms";

const Sidebar = () => {
  const [data, setData] = useAtom(treeDataAtom)
  const [cursor, setCursor] = useState(null);

  const handleActionChange = (value) => {
    // dummy function
    console.log(`Selected action: ${value}`);
  };

  const handleAddFrame = () => {
    // dummy function
    console.log("Frame added");
  };

  return (
    <div className="w-[15vw] items-center p-2 bg-secondary">
      {/* AssetHandler Component */}
      <AssetHandler data={data} setData={setData} cursor={cursor} setCursor={setCursor} />

      {/* Add Action */}
      <Select onValueChange={handleActionChange}>
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
      <Button onClick={handleAddFrame} className="mt-1 bg-input text-black w-full">
        Add Frame
      </Button>

      {/* SceneGraph Component */}
      <SceneGraph data={data} setData={setData} />
    </div>
  );
};

export default Sidebar;
