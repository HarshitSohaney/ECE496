import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { selectedObjectAtom, selectedKeyframeAtom } from "../atoms";
import ARControls from "./ARControls";
import KeyframeControls from "./KeyframeControls";

const AssetControllers = () => {
  const [selectedObject] = useAtom(selectedObjectAtom);
  const [selectedKeyframe] = useAtom(selectedKeyframeAtom);
  const [activeTab, setActiveTab] = useState("global");

  return (
    <div className="w-[18vw] h-[63vh] bg-secondary rounded shadow-lg overflow-y-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full sticky top-0 bg-secondary z-10">
          <TabsTrigger value="global">Object</TabsTrigger>
          <TabsTrigger value="keyframe">Keyframe</TabsTrigger>
        </TabsList>

        <div className="p-2">
          <TabsContent value="global">
            {selectedObject ? <ARControls /> : <p className="text-center text-sm">No object selected.</p>}
          </TabsContent>

          <TabsContent value="keyframe">
            {selectedKeyframe ? <KeyframeControls /> : <p className="text-center text-sm">No keyframe selected.</p>}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AssetControllers;
