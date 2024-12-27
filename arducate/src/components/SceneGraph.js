import React, { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { arObjectsAtom, selectedObjectAtom } from "../atoms";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronDown, Folder, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TreeNode = ({
  node,
  level = 0,
  onToggle,
  onAddFolder,
  onRename,
  selectedId,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(node.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRename(node.id, nodeName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setNodeName(node.name);
    }
  };

  return (
    <div className="transition-opacity duration-200">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center p-1 rounded-md group relative transition-colors duration-200",
              selectedId === node.id && "bg-blue-50 text-blue-600",
              !selectedId === node.id && "hover:bg-gray-50",
              "active:scale-[0.99] hover:scale-[1.01]"
            )}
            style={{ marginLeft: `${level * 16}px` }}
            onClick={() => onSelect(node)}
          >
            {node.children && (
              <div
                className={cn(
                  "p-1 hover:bg-gray-100 rounded cursor-pointer transition-transform duration-200",
                  node.toggled && "rotate-90"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(node);
                }}
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </div>
            )}

            <div className="flex items-center gap-2 flex-1 min-w-0">
              {node.children && (
                <Folder className="h-4 w-4 text-gray-500 shrink-0" />
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex-1">
                  <Input
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="h-6 py-1"
                  />
                </form>
              ) : (
                <span className="truncate">{node.name}</span>
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          {node.children && (
            <ContextMenuItem onClick={() => onAddFolder(node.id)}>
              Add Folder
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            Rename
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {node.toggled && node.children && (
        <div className="transition-all duration-200">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              onToggle={onToggle}
              onAddFolder={onAddFolder}
              onRename={onRename}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SceneGraph = ({ data, setData }) => {
  const [arObjects] = useAtom(arObjectsAtom);
  const [selectedObject, setSelectedObject] = useAtom(selectedObjectAtom);

  const findNodeById = useCallback((node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const result = findNodeById(child, id);
        if (result) return result;
      }
    }
    return null;
  }, []);

  const handleToggle = useCallback(
    (node) => {
      node.toggled = !node.toggled;
      setData({ ...data });
    },
    [data, setData]
  );

  const handleAddFolder = useCallback(
    (parentId) => {
      const parent = findNodeById(data, parentId);
      if (parent) {
        const newFolder = {
          id: Date.now(),
          name: "New Folder",
          toggled: true,
          children: [],
        };
        parent.children = [...(parent.children || []), newFolder];
        parent.toggled = true;
        setData({ ...data });
      }
    },
    [data, setData, findNodeById]
  );

  const handleRename = useCallback(
    (nodeId, newName) => {
      const node = findNodeById(data, nodeId);
      if (node) {
        node.name = newName;
        setData({ ...data });
      }
    },
    [data, setData, findNodeById]
  );

  const handleSelect = useCallback(
    (node) => {
      const selectedObj = arObjects.find((obj) => obj.id === node.id);
      if (selectedObj) {
        setSelectedObject(selectedObj);
      }
    },
    [arObjects, setSelectedObject]
  );

  return (
    <Card className="bg-white shadow-sm rounded-md w-full mt-2 h-1/2">
      <div className="font-sm font-bold mb-2 border-b border-gray-200">
        <div className="p-2">Layers</div>
      </div>
      <div className="overflow-y-auto max-h-[calc(100%-2rem)] p-2">
        {data.children && data.children.length > 0 ? (
          data.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={0}
              onToggle={handleToggle}
              onAddFolder={handleAddFolder}
              onRename={handleRename}
              selectedId={selectedObject?.id}
              onSelect={handleSelect}
            />
          ))
        ) : (
          <div className="flex items-center flex-col justify-center h-full text-gray-500">
            <div className="text-lg font-semibold">No Assets Added</div>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Your 3D assets will show here
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SceneGraph;