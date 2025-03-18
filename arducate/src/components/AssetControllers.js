import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedObjectAtom, selectedKeyframeAtom } from "../atoms";
import ARControls from "./ARControls";
import KeyframeControls from "./KeyframeControls";

const AssetControllers = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [selectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [activeTab, setActiveTab] = useState("global");

  // Force active tab based solely on keyframe selection.
  useEffect(() => {
    if (selectedKeyframe?.keyframeId) {
      setActiveTab("keyframe");
    } else {
      setActiveTab("global");
    }
  }, [selectedKeyframe]);

  // Only allow tab changes if a keyframe is selected; otherwise force global.
  const handleTabChange = (newTab) => {
    if (!selectedKeyframe?.keyframeId) {
      setActiveTab("global");
    } else {
      setActiveTab(newTab);
    }
  };

  return (
    <div className="w-[18vw] h-[63vh] bg-secondary rounded shadow-lg overflow-y-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-2 w-full sticky top-0 bg-secondary z-10">
          <TabsTrigger
            value="global"
            disabled={!!selectedKeyframe?.keyframeId} // Disable Object tab if a keyframe is selected.
          >
            Object
          </TabsTrigger>
          <TabsTrigger
            value="keyframe"
            disabled={!selectedKeyframe?.keyframeId} // Disable Keyframe tab if no keyframe is selected.
          >
            Keyframe
          </TabsTrigger>
        </TabsList>
        <div className="p-2">
          <TabsContent value="global">
            <ARControls />
          </TabsContent>
          <TabsContent value="keyframe">
            <KeyframeControls />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AssetControllers;
