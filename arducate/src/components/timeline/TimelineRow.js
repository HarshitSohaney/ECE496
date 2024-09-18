import React from 'react';
import { useAtom } from 'jotai';
import KeyframeBar from './KeyframeBar';
import { arObjectsAtom, timelineScaleAtom, timelineWidthAtom } from "../../atoms";

const TimelineRow = ({ objectId, timeRulerStart, timeRulerEnd }) => {
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [timelineWidth] = useAtom(timelineWidthAtom);

  const object = arObjects.find(obj => obj.id === objectId);

  const handleUpdate = (updatedRange) => {
    setArObjects(prevObjects =>
      prevObjects.map(obj =>
        obj.id === objectId
          ? { ...obj, startTime: updatedRange.start, endTime: updatedRange.end }
          : obj
      )
    );
  };

  return (
    <div className="flex items-center h-8 relative border-b border-gray-700">
      <div className="flex-grow relative h-full flex items-center">
        <KeyframeBar
          start={object.startTime || 0}
          end={object.endTime || 5}
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
