// src/atoms/index.js
import { atom } from "jotai";

// This is where we can add all the global atoms that we want to use

// Atom to manage the list of AR objects
export const arObjectsAtom = atom([]);

// Atom to manage the currently selected object
export const selectedObjectAtom = atom(null);

// Atom to manage AR controls (e.g., for manipulating selected object)
export const arControlsAtom = atom({
  rotation: 0,
  scale: [1, 1, 1],
  position: [0, 0, 0],
  color: "#ffa500",
});
