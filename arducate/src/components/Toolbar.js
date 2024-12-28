// src/components/Toolbar.js
import React, { useState } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, transformModeAtom } from "../atoms";
import { convertSceneToAR } from "./Conversion/ARPublish";
import { convertSceneToVR } from "./Conversion/VRPublish";
import { Button } from "../@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../@/components/ui/select";
import { Move, MoveDiagonal, RotateCw } from "lucide-react";
import AssetHandler from "./AssetHandler";
import { treeDataAtom } from "../atoms";
import { supabase } from './supabaseClient'; // Adjust the import path as necessary
import { v4 as uuidv4 } from 'uuid'; // Install uuid package for unique IDs

const Toolbar = () => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [data, setData] = useAtom(treeDataAtom);
  const [cursor, setCursor] = useState(null);

  const handlePreview = () => {
    const htmlContent = convertSceneToVR(arObjects);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handlePublish = async () => {
    const htmlContent = convertSceneToAR(arObjects);
    const uniqueId = uuidv4(); // Generate a unique ID for the content
  
    try {
      const { data, error } = await supabase
        .from('ar_content')
        .insert([
          { url: uniqueId, html_content: htmlContent }
        ]);
  
      if (error) {
        throw new Error('Failed to save content: ' + error.message);
      }
  
      // Open the unique URL in a new tab
      const arContentUrl = `${window.location.origin}/ar-content/${uniqueId}`;
      window.open(arContentUrl, '_blank');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <nav className="w-full bg-primary p-2 flex justify-between items-center">
      {/* Left Aligned Buttons */}
      <div className="navbar-button-container">
        <AssetHandler
          data={data}
          setData={setData}
          cursor={cursor}
          setCursor={setCursor}
        />
        {/* <Select>
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
        </Select> */}
      </div>

      {/* Center Aligned */}
      <div className="flex-grow text-center">
        <h2 className="scroll-m-20 text-1xl font-semibold text-white">
          ARducate
        </h2>
      </div>

      {/* Right Aligned */}
      <div className="navbar-button-container">

        <Button
          variant="outline"
          onClick={handlePreview}
          className="navbar-button"
        >
          Preview
        </Button>

        <Button
          variant="outline"
          className="navbar-button"
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
