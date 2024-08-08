import { atom } from "jotai";

export const userAtom = atom({
  id: null,
  name: "",
  preferences: {},
});

export const arObjectsAtom = atom([]);
export const selectedObjectAtom = atom(null);
export const cameraPositionAtom = atom({ x: 0, y: 0, z: 5 });
