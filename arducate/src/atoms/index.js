// src/atoms/index.js
import { atom } from "jotai";

// This is where we can add all the global atoms that we want to use

// Atom to manage the list of AR objects
//export const arObjectsAtom = atom([]);
export const arObjectsAtom = atom(
  [],
  (get, set, action) => {
    switch (action.type) {
      case 'ADD_OBJECT':
        set(arObjectsAtom, [...get(arObjectsAtom), action.payload]);
        break;
      case 'REMOVE_OBJECT':
        set(arObjectsAtom, get(arObjectsAtom).filter(obj => obj.id !== action.payload));
        break;
      case 'UPDATE_OBJECT':
        set(arObjectsAtom, get(arObjectsAtom).map(obj => 
          obj.id === action.payload.id ? { ...obj, ...action.payload } : obj
        ));
        break;
      default:
        console.error('Unknown action type:', action.type);
    }
  }
);
// Atom to manage the currently selected object
export const selectedObjectAtom = atom(null);

// Atom to manage Add Atom Dropdown
export const addAssetAtom = atom('');

// Atom to manage the transform mode ('translate', 'rotate' or 'scale')
export const transformModeAtom = atom('translate');
