// src/atoms/index.js
import { atom } from "jotai";

// This is where we can add all the global atoms that we want to use

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
      break;
    case "REMOVE_OBJECT":
      set(
        arObjectsAtom,
        get(arObjectsAtom).filter((obj) => obj.id !== action.payload)
      ); //sets arObjects to one without that ID in it
      set(selectedObjectAtom, null);
      set(treeDataAtom, (treeData) =>
        removeFromTreeData({ ...treeData }, action.payload)
      );

      break;
    case "UPDATE_OBJECT":
      // console.log('Atom UPDATE_OBJECT - Received payload:', action.payload);
      const updatedObjects = get(arObjectsAtom).map((obj) => {
        if (obj.id === action.payload.id) {
          const updatedObj = { ...obj, ...action.payload };
          // console.log('Atom UPDATE_OBJECT - Before update:', obj);
          // console.log('Atom UPDATE_OBJECT - After update:', updatedObj);
          return updatedObj;
        }
        return obj;
      });
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

export const selectedObjectsAtom = atom([]);
export const groupsAtom = atom([], (get, set, action) => {
  switch (action.type) {
    case "CREATE_GROUP": {
      const newGroup = {
        id: Date.now(),
        name: `Group ${get(groupsAtom).length + 1}`,
        objectIds: action.payload.objectIds,
        threeGroup: action.payload.threeGroup,
      };
      set(groupsAtom, [...get(groupsAtom), newGroup]);
      console.log("CREATE_GROUP - groupsAtom:", get(groupsAtom));
      break;
    }
    case "UPDATE_GROUP": {
      set(
        groupsAtom,
        get(groupsAtom).map((group) =>
          group.id === action.payload.id
            ? { ...group, ...action.payload }
            : group
        )
      );
      break;
    }
    case "DELETE_GROUP": {
      set(
        groupsAtom,
        get(groupsAtom).filter((group) => group.id !== action.payload)
      );
      break;
    }
    default:
      break;
  }
});

export const transformControlsRefAtom = atom(null);
