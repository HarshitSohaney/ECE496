// src/components/Sidebar.js
import React, { useState } from "react";
import SceneGraph from "./SceneGraph";
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
import { treeDataAtom } from "../atoms";
import { Move, MoveDiagonal, RotateCw } from "lucide-react";
import { transformModeAtom } from "../atoms";

const Sidebar = () => {
  const [data, setData] = useAtom(treeDataAtom);
  const [cursor, setCursor] = useState(null);
  const [, setTransformMode] = useAtom(transformModeAtom);

  const handleActionChange = (value) => {
    // dummy function
    console.log(`Selected action: ${value}`);
  };

  const handleAddFrame = () => {
    // dummy function
    console.log("Frame added");
  };

  return (
    <div className="w-[15vw] items-center p-2 bg-secondary flex flex-col space-y-2 overflow-y-auto">
      {/* Add Action */}
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
      </div>

      {/* <Select onValueChange={handleActionChange}>
        <SelectTrigger variant="outline" className="mt-1">
          <SelectValue placeholder="Add Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="translate">Translation</SelectItem>
            <SelectItem value="rotate">Rotation</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select> */}

      {/* Add Frame */}
      {/* <Button onClick={handleAddFrame} className="mt-1 bg-input text-black w-full">
        Add Frame
      </Button> */}

      {/* SceneGraph Component */}
      <SceneGraph data={data} setData={setData} />
    </div>
  );
};

export default Sidebar;
