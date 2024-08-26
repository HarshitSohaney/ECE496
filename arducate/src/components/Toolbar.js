// src/components/Toolbar.js
import React from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, transformModeAtom } from "../atoms";
import { convertSceneToAR, convertSceneToVR } from "./ARPublish";
import { Button } from "../@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "../@/components/ui/select"
import { Move, MoveDiagonal, RotateCw } from "lucide-react";

const Toolbar = () => {
  const [, setTransformMode] = useAtom(transformModeAtom);
  const [arObjects, setARObjects] = useAtom(arObjectsAtom);

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
      <div className="navbar-button-container">
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
      <div className="navbar-button-container">
        <Button variant="outline" size="icon" className="navbar-button" onClick={() => setTransformMode('translate')}>
          <Move/>
        </Button>

        <Button variant="outline" size="icon" className="navbar-button" onClick={() => setTransformMode('scale')}>
          <MoveDiagonal/>
        </Button>

        <Button variant="outline" size="icon" className="navbar-button" onClick={() => setTransformMode('rotate')}>
          <RotateCw/>
        </Button>

        <Button variant="outline" className="navbar-button" onClick={handlePublish}>
          Publish
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
