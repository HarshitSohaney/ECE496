// src/components/Toolbar.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, transformModeAtom } from "../atoms";
import { convertSceneToAR, convertSceneToVR } from "./ARPublish";
import { Button } from "../@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from "../@/components/ui/select"
import { Move, MoveDiagonal, RotateCw } from "lucide-react";

const Toolbar = () => {
  const [, setTransformMode] = useAtom(transformModeAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

  const handleAddObject = () => {
    const newObject = {
      id: Date.now(),
      position: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#ffa500",
      type: "box",
      entity: "a-box",
    };
    setARObjects((prev) => [...prev, newObject]);
  };

  const handlePreview = () => {
    const htmlContent = convertSceneToVR(arObjects);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePublish = () => {
    const htmlContent = convertSceneToAR(arObjects);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <nav className="w-full bg-primary p-2 flex justify-between items-center">

      {/* Left Aligned Buttons */}
      <div className="flex-shrink-0 flex items-center space-x-4 bg-primary">
        <Button variant="outline"
          onClick={handlePreview}
          className="navbar-button"
        >
          Preview
        </Button>
        
        <Select>
          <SelectTrigger variant="outline" className="w-[180px] navbar-button">
            <SelectValue placeholder="Perspective"/>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="x">Opt 1</SelectItem>
              <SelectItem value="y">Opt 2</SelectItem>
              <SelectItem value="z">Opt 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Center Aligned */}
      <div className="flex-grow text-center">
        <h2 className="scroll-m-20 text-1xl font-semibold text-white">My Project/Frame 2</h2>
      </div>

      {/* Right Aligned */}
      <div className="flex-shrink-0 flex items-center space-x-4 bg-primary">
        <Button variant="outline" size="icon" className="navbar-button">
          <Move/>
        </Button>

        <Button variant="outline" size="icon" className="navbar-button">
          <MoveDiagonal/>
        </Button>

        <Button variant="outline" size="icon" className="navbar-button">
          <RotateCw/>
        </Button>

        <Button variant="outline" className="navbar-button" onClick={handlePublish}>
          Publish
        </Button>
      </div>

      {/* <Button variant="outline"
        onClick={handleAddObject}
        className="mr-4"
      >
        Add Box
      </button>
      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Preview
      </button>
      <button
        onClick={handlePublish}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Publish
      </button>
      <button
        onClick={() => setTransformMode('translate')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-4"
      >
        Translate
      </button>
      <button
        onClick={() => setTransformMode('rotate')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-4"
      >
        Rotate
      </button>
      <button
        onClick={() => setTransformMode('scale')}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 mr-4"
      >
        Scale
      </button>
    </div>
  );
};

export default Toolbar;
