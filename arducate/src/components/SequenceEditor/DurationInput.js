import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { timelineDurationAtom } from "../../atoms";

const DEFAULT_DURATION = 20;

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${ms.toString().padStart(2, "0")}`;
};

const parseFormattedTime = (timeStr) => {
  const [mins, secs, ms] = timeStr.split(':').map(Number);
  return mins * 60 + secs + ms / 100;
};

const DurationInput = ({ currentTime }) => {
  const [duration, setDuration] = useAtom(timelineDurationAtom);
  const [inputValue, setInputValue] = useState(formatTime(duration || DEFAULT_DURATION));

  useEffect(() => {
    setInputValue(formatTime(duration || DEFAULT_DURATION));
  }, [duration]);

  const handleDurationChange = (e) => {
    setInputValue(e.target.value);
  };

  const updateDuration = () => {
    // Try to parse as formatted time first
    if (inputValue.includes(':')) {
      try {
        const seconds = parseFormattedTime(inputValue);
        if (!isNaN(seconds) && seconds >= 0) {
          setDuration(seconds);
          setInputValue(formatTime(seconds));
          return;
        }
      } catch (e) {
        // If parsing fails, fall through to number parsing
      }
    }

    // Fall back to parsing as plain number
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      setDuration(value);
      setInputValue(formatTime(value));
    } else {
      setInputValue(formatTime(duration || DEFAULT_DURATION));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateDuration();
      e.target.blur();
    } else if (e.key === "Escape") {
      setInputValue(formatTime(duration || DEFAULT_DURATION));
      e.target.blur();
    }
  };

  return (
    <div className="flex items-center space-x-1.5 text-sm">
      <div className="text-gray-300 tracking-wider">
        {formatTime(currentTime)}
      </div>
      <span className="text-gray-500">/</span>
      <div className="relative w-[120px]">
        <Input
          type="text"
          pattern="[0-9:.]+"
          value={inputValue}
          onChange={handleDurationChange}
          onBlur={updateDuration}
          onKeyDown={handleKeyDown}
          className="h-4 px-2 py-0 text-sm bg-gray-800/50 border-gray-700
                   focus:border-gray-500 focus:bg-gray-800/80 focus:ring-0
                   transition-colors duration-200"
        />
      </div>
    </div>
  );
};

export default DurationInput;
