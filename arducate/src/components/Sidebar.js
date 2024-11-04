import React, { useState } from "react";
import SceneGraph from "./SceneGraph";
import AssetHandler from "./AssetHandler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../@/components/ui/tabs";
import { Input } from "../@/components/ui/input";
import { useAtom } from "jotai";
import { treeDataAtom, timelineDurationAtom } from "../atoms";
import { Clock } from "lucide-react";

// import React from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../@/components/ui/tabs";
// import { Input } from "../@/components/ui/input";
// import { useAtom } from "jotai";
// import { treeDataAtom, timelineDurationAtom } from "../atoms";
// import { Clock } from "lucide-react";

const Sidebar = () => {
  const [data, setData] = useAtom(treeDataAtom);
  const [duration, setDuration] = useAtom(timelineDurationAtom);

  const handleDurationChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDuration(value);
    }
  };

  return (
    <aside className="w-[15vw] h-full flex flex-col bg-secondary border-r border-border">
      <Tabs defaultValue="assets" className="flex-1 flex flex-col">
        <div className="border-b border-border">
          <TabsList className="w-full h-10 grid grid-cols-2">
            <TabsTrigger
              value="assets"
              className="text-sm font-medium data-[state=active]:bg-secondary"
            >
              Assets
            </TabsTrigger>
            <TabsTrigger
              value="animation"
              className="text-sm font-medium data-[state=active]:bg-secondary"
            >
              Animation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="assets"
          className="flex-1 overflow-auto p-3"
        >
          <AssetHandler data={data} setData={setData} />
          <SceneGraph data={data} setData={setData} />
        </TabsContent>

        <TabsContent
          value="animation"
          className="flex-1 p-3"
        >
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground/70 px-1">Animation Duration</h3>
            <div className="relative">
              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                type="number"
                min="0"
                step="0.1"
                className="pl-8 bg-background"
                value={duration}
                onChange={handleDurationChange}
                placeholder="Duration (seconds)"
              />
            </div>
            <p className="text-xs text-muted-foreground px-1">
              Animation duration in seconds
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default Sidebar;
