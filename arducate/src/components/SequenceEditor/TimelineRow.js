import React from 'react';
import { useAtom } from 'jotai';
import { arObjectsAtom, timelineScaleAtom, timelineWidthAtom } from "../../atoms";
import KeyframeBar from './KeyframeBar';

const TimelineRow = ({ objectId, timeRulerStart, timeRulerEnd }) => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [scale] = useAtom(timelineScaleAtom);
  const [timelineWidth] = useAtom(timelineWidthAtom);

  const object = arObjects.find(obj => obj.id === objectId);

  return (
    <div className="flex items-center h-8 relative border-b border-gray-700">
      <div className="flex-grow relative h-full flex items-center">
        <KeyframeBar
          objectId={objectId}
          keyframes={object.keyframes || []}
          scale={scale}
          timeRulerStart={timeRulerStart}
          timeRulerEnd={timeRulerEnd}
          timelineWidth={timelineWidth}
        />
      </div>
    </div>
  );
};

export default TimelineRow;
