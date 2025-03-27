import { useCallback } from "react";
import { useAtom } from "jotai";
import { selectedObjectAtom, arObjectsAtom } from "../atoms";

export const useObjectHandlers = () => {
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);
  const [, setARObjects] = useAtom(arObjectsAtom);

  const handleColorChange = (e) => {
    if (selectedObject) {
      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          ...selectedObject,
          color: e.target.value,
        },
      });
    }
  };

  const handleScaleChange = (axis, scaleValue) => {
    if (selectedObject) {
      const newScale = [...selectedObject.scale];
      newScale[axis] = parseFloat(scaleValue);
      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          ...selectedObject,
          scale: newScale,
        },
      });
    }
  };

  const handlePositionChange = (axis, value) => {
    if (selectedObject) {
      const newPos = [...selectedObject.position];
      newPos[axis] = parseFloat(value);
      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          ...selectedObject,
          position: newPos,
        },
      });
    }
  };

  const handleRotationChange = (axis, value) => {
    if (!selectedObject) return;
    console.log("selectedObject", selectedObject.rotation);
    const newRotation = [...selectedObject.rotation];
    newRotation[axis] = parseFloat(value);
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        ...selectedObject,
        rotation: newRotation,
      },
    });
  };

  const handleVisibilityChange = (checked) => {
    if (selectedObject) {
      if (!checked) {
        setSelectedObject(null);
      }
      setARObjects({
        type: "UPDATE_OBJECT",
        payload: {
          ...selectedObject,
          visible: checked,
        },
      });
    }
  };

  const handleDeleteAsset = useCallback(() => {
    if (selectedObject) {
      setARObjects({ type: "REMOVE_OBJECT", payload: selectedObject.id });
    }
  }, [selectedObject, setARObjects]);
  const handleLabelChange = (e) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        label: e.target.value,
      },
    });
  };
  const handleLabelVisibilityChange = (checked) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        showLabel: checked,
      },
    });
  };
  const handleTextChange = (e) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        text: e.target.value,
      },
    });
  };
  const handleNameChange = (e) => {
    setARObjects({
      type: "UPDATE_OBJECT",
      payload: {
        id: selectedObject.id,
        name: e.target.value,
      },
    });
  };
  return {
    handleColorChange,
    handleScaleChange,
    handlePositionChange,
    handleRotationChange,
    handleVisibilityChange,
    handleDeleteAsset,
    handleLabelChange,
    handleLabelVisibilityChange,
    handleTextChange,
    handleNameChange,
  };
};
