import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { timelineDurationAtom } from "../../atoms";
import { Clock } from "lucide-react";

const DEFAULT_DURATION = 20;

const DurationInput = () => {
  const [duration, setDuration] = useAtom(timelineDurationAtom);
  const [inputValue, setInputValue] = useState(duration || DEFAULT_DURATION);

  useEffect(() => {
    setInputValue(duration || DEFAULT_DURATION);
  }, [duration]);

  const handleDurationChange = (e) => {
    setInputValue(e.target.value);
  };

  const updateDuration = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value > 0) {
      setDuration(value);
    } else {
      setInputValue(duration || DEFAULT_DURATION);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateDuration();
      e.target.blur();
    } else if (e.key === "Escape") {
      setInputValue(duration || DEFAULT_DURATION);
      e.target.blur();
    }
  };

  return (
    <div className="p-4 space-y-4">
    <div>
      <h4 className="text-sm font-medium leading-none text-gray-400">
        Animation Settings
      </h4>
    </div>

    <div className="space-y-2">
      <Label className="text-xs text-gray-400">Timeline Duration</Label>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <div className="relative flex items-center">
          <Input
            placeholder="Enter timeline duration..."
            type="number"
            min="0.1"
            step="0.1"
            value={inputValue}
            onChange={handleDurationChange}
            onBlur={updateDuration}
            onKeyDown={handleKeyDown}
            className="h-8 w-24 text-sm bg-gray-800/50 border-gray-700 text-gray-100
                       focus:border-gray-500 focus:bg-gray-800/80 focus:ring-0 pr-8"
          />
          <span className="absolute right-3 text-sm text-gray-400">s</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default DurationInput;
