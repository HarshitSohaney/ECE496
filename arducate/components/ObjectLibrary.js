"use client";

import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom } from "../atoms/globalAtoms";

export default function ObjectLibrary() {
  const [arObjects, setArObjects] = useAtom(arObjectsAtom);
  const [, setSelectedObject] = useAtom(selectedObjectAtom);

  const addObject = () => {
    const newObject = {
      id: Date.now(),
      type: "cube",
      color: `hsl(${Math.random() * 360}, 100%, 75%)`,
    };
    setArObjects([...arObjects, newObject]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-2xl font-semibold mb-4">Object Library</h2>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={addObject}
      >
        Add Cube
      </button>
      <ul className="space-y-2">
        {arObjects.map((obj) => (
          <li
            key={obj.id}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
            onClick={() => setSelectedObject(obj)}
          >
            {obj.type} (ID: {obj.id})
            <div
              className="w-6 h-6 inline-block ml-2 rounded"
              style={{ backgroundColor: obj.color }}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
