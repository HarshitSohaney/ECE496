// src/atoms/index.js
import { atom } from "jotai";

// This is where we can add all the global atoms that we want to use

// Helper function to recursively remove an object from treeData
const removeFromTreeData = (node, idToRemove) => {
  if (node.children) {
    node.children = node.children.filter(child => child.id !== idToRemove);
    node.children.forEach(child => removeFromTreeData(child, idToRemove));
  }
  return node;
};


// Atom to manage the list of AR objects
export const arObjectsAtom = atom(
  [],
  (get, set, action) => {
    switch (action.type) {
      case 'ADD_OBJECT':
        set(arObjectsAtom, [...get(arObjectsAtom), action.payload]); //payload: newObject adds to end of arObjects
        break;
      case 'REMOVE_OBJECT':
        set(arObjectsAtom, get(arObjectsAtom).filter(obj => obj.id !== action.payload)); //sets arObjects to one without that ID in it
        set(selectedObjectAtom, null);
        set(treeDataAtom, treeData => removeFromTreeData({...treeData}, action.payload));

        break;
      case 'UPDATE_OBJECT':
        const updatedObjects = get(arObjectsAtom).map(obj =>  //payload: ...selectedObject, scale: [scaleValue, scaleValue, scaleValue]} 
          obj.id === action.payload.id 
            ? { ...obj, ...action.payload }
            : obj
        );
        set(arObjectsAtom, updatedObjects);
        // Update selectedObjectAtom if it's the object being updated
        const currentSelected = get(selectedObjectAtom);
        if (currentSelected && currentSelected.id === action.payload.id) {
          set(selectedObjectAtom, updatedObjects.find(obj => obj.id === action.payload.id));
        }
        break;
      default:
        console.error('Unknown action type:', action.type);
    }
  }
);
// Atom to manage the data in treeboard
export const treeDataAtom = atom({
  name: "root",
  toggled: true,
  children: [],
});

// Atom to manage the currently selected object
export const selectedObjectAtom = atom(null);

// Atom to manage Add Atom Dropdown
export const addAssetAtom = atom('');

// Atom to manage the transform mode ('translate', 'rotate' or 'scale')
export const transformModeAtom = atom('translate');

// Atoms to manage the animation editor UI
export const timelineScaleAtom = atom(100);
export const currentTimeAtom = atom(0);
export const isPlayingAtom = atom(false);
export const timelineWidthAtom = atom(0);