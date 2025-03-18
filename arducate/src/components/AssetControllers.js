import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedObjectAtom, selectedKeyframeAtom } from "../atoms";
import ARControls from "./ARControls";
import KeyframeControls from "./KeyframeControls";

const AssetControllers = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [selectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [activeTab, setActiveTab] = useState("global");

  // Automatically switch tabs when a keyframe or object is selected
  useEffect(() => {
    if (selectedKeyframe?.keyframeId) {
      setActiveTab("keyframe");
    } else if (selectedObject) {
      setActiveTab("global");
    }
  }, [selectedKeyframe, selectedObject]);

    return (
      <div className="flex flex-col h-full bg-secondary rounded shadow-lg overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          {/* Tabs List (Header) */}
          <TabsList className="grid grid-cols-2 w-full sticky top-0 bg-secondary z-10">
            <TabsTrigger value="global">Object</TabsTrigger>
            <TabsTrigger value="keyframe" disabled={!selectedKeyframe?.keyframeId}>
              Keyframe
            </TabsTrigger>
          </TabsList>
  
          {/* Content Area */}
          <div className="flex-1 p-2 overflow-auto">
            <TabsContent value="global" className="h-full">
              <ARControls />
            </TabsContent>
  
            <TabsContent value="keyframe" className="h-full">
              <KeyframeControls />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  };
  

export default AssetControllers;
