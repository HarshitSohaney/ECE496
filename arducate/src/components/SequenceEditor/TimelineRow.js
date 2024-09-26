import React from 'react';
import { useAtom } from 'jotai';
import KeyframeBar from './KeyframeBar';
import { arObjectsAtom, timelineScaleAtom, timelineWidthAtom } from "../../atoms";

const TimelineRow = ({ objectId, timeRulerStart, timeRulerEnd }) => {
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [timelineWidth] = useAtom(timelineWidthAtom);

  const object = arObjects.find(obj => obj.id === objectId);

  const handleUpdate = (updatedKeyframes) => {
    setArObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === objectId
          ? { ...obj, keyframes: updatedKeyframes }
          : obj
      )
    );
  };

  return (
    <div className="flex items-center h-8 relative border-b border-gray-700">
      <div className="flex-grow relative h-full flex items-center">
        <KeyframeBar
          keyframes={object.keyframes || []}
          scale={scale}
          onUpdate={handleUpdate}
          timeRulerStart={timeRulerStart}
          timeRulerEnd={timeRulerEnd}
          timelineWidth={timelineWidth}
        />
      </div>
    </div>
  );
};

export default TimelineRow;
