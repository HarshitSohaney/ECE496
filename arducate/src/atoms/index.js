// src/atoms/index.js
import { atom } from "jotai";

// This is where we can add all the global atoms that we want to use

/*
store the version history, to be used for undo/redo
structure of history object:
{
  action: 'ADD_OBJECT' | 'REMOVE_OBJECT' | 'UPDATE_OBJECT',
  from: object,
  to: object,
  timestamp: Date.now(),
}
*/
export const historyAtom = atom([]);

// Helper function to recursively remove an object from treeData
const removeFromTreeData = (node, idToRemove) => {
  if (node.children) {
    node.children = node.children.filter((child) => child.id !== idToRemove);
    node.children.forEach((child) => removeFromTreeData(child, idToRemove));
  }
  return node;
};

// Atom to manage the list of AR objects
export const arObjectsAtom = atom([], (get, set, action) => {
  switch (action.type) {
    case "ADD_OBJECT":
      set(arObjectsAtom, [...get(arObjectsAtom), action.payload]); //payload: newObject adds to end of arObjects
      // add it to the treeData
      set(treeDataAtom, (treeData) => {
        const newObject = {
          id: action.payload.id,
          name: action.payload.name,
        };
        return {
          ...treeData,
          children: [...treeData.children, newObject],
        };
      });

      const historyLog = {
        action: "ADD_OBJECT",
        from: null,
        to: action.payload,
        timestamp: Date.now(),
      };

      set(historyAtom, [...get(historyAtom), historyLog]);
      break;
    case "REMOVE_OBJECT":
      const objectToRemove = get(arObjectsAtom).find(
        (obj) => obj.id === action.payload
      );
      set(
        arObjectsAtom,
        get(arObjectsAtom).filter((obj) => obj.id !== action.payload)
      ); //sets arObjects to one without that ID in it
      set(selectedObjectAtom, null);
      set(treeDataAtom, (treeData) =>
        removeFromTreeData({ ...treeData }, action.payload)
      );

      const historyLogRemove = {
        action: "REMOVE_OBJECT",
        from: objectToRemove, // Store the full object
        to: null,
        timestamp: Date.now(),
      };
      set(historyAtom, [...get(historyAtom), historyLogRemove]);

      break;
    case "UPDATE_OBJECT":
      const updatedObjects = get(arObjectsAtom).map((obj) => {
        if (obj.id === action.payload.id) {
          return {
            ...obj,
            ...action.payload,
            keyframes: [
              ...new Map(
                [...(obj.keyframes || []), ...(action.payload.keyframes || [])].map(kf => [kf.id, kf])
              ).values(),
            ],
          };
        }
        return obj;
      });
      const prevState = updatedObjects.find(
        (obj) => obj.id === action.payload.id
      );
      set(arObjectsAtom, updatedObjects);

      // Update selectedObjectAtom if it's the object being updated
      const currentSelected = get(selectedObjectAtom);
      if (currentSelected && currentSelected.id === action.payload.id) {
        const updatedSelected = updatedObjects.find(
          (obj) => obj.id === action.payload.id
        );
        // console.log('Atom UPDATE_OBJECT - Updating selectedObject:', updatedSelected);
        set(selectedObjectAtom, updatedSelected);
      }
      const historyLogUpdate = {
        action: "UPDATE_OBJECT",
        from: prevState,
        to: updatedObjects,
        timestamp: Date.now(),
      };
      set(historyAtom, [...get(historyAtom), historyLogUpdate]);
      break;
    default:
      console.error("Unknown action type:", action.type);
  }
});

// Atom to manage the data in treeboard
export const treeDataAtom = atom({
  name: "root",
  toggled: true,
  children: [],
});

// Atom to manage the currently selected object
export const selectedObjectAtom = atom(null);

// Atom to manage Add Atom Dropdown
export const addAssetAtom = atom("");

// Atom to manage the transform mode ('translate', 'rotate' or 'scale')
export const transformModeAtom = atom("translate");

// Atoms to manage the animation editor UI
export const timelineScaleAtom = atom(100);
export const currentTimeAtom = atom(0);
export const isPlayingAtom = atom(false);
export const timelineWidthAtom = atom(0);
export const timelineDurationAtom = atom(20);

export const selectedKeyframeAtom = atom({ keyframeId: null, objectId: null });
export const interpolationsAtom = atom({});

export const copyBufferAtom = atom(null);
