import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable"; //Added for swapping support

// Draggable toolbox item
const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 m-2 border cursor-move bg-white rounded shadow"
    >
      {label}
    </div>
  );
};

// Canvas area
const Canvas = ({ elements, setElements, onTextChange, onImageChange, onDelete }) => {
  const { setNodeRef: setDropRef} = useDroppable({ id: "canvas" });

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(index, url);
    }
  };
  return ( 
  <div ref={setDropRef} className="flex-1 min-h-screen p-4 border bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Canvas</h2>
      {elements.map((el, index) => {
        const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id: index.toString() });

        return (
    <div 
    ref={setDragRef}
    key={index.toString()} 
    id={index.toString()} 
    {...listeners}
    {...attributes}
    className="p-2 my-2 border bg-white rounded shadow" 
    >
          {el.type === "text" && (
            <div className="relative">
            <input
              type="text"
              value={el.content}
              onChange={(e) => onTextChange(index, e.target.value)}
              placeholder="Enter text"
              className="w-full p-1 border rounded"
            />
            <button
      onClick={() => onDelete(index)}
      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
    >
      ✕
    </button>
  </div>
          )}

          {el.type === "image" && (
            el.src ? (
              <div className="relative">
                <img src={el.src} alt="Uploaded" className="max-w-full h-auto rounded" />
                <button
                  onClick={() => onDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                >✕</button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
              />
            )
          )}

          {el.type === "button" && (
            <div className="relative">
            {el.editing ? (
              <input
                type="text"
                value={el.content}
                onChange={(e) => onTextChange(index, e.target.value)}
                onBlur={() => {
                  const updated = [...elements];
                  updated[index].editing = false;
                  setElements(updated);
                }}
                placeholder="Enter button text"
                className="w-full p-1 border rounded text-black"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  const updated = [...elements];
                  updated[index].editing = true;
                  setElements(updated);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                {el.content.trim() || "Click Me"}
              </button>
            )}
            <button
            onClick={() => onDelete(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
          >
            ✕
          </button>
        </div>
          )}   
        </div>
  );
  })}
  </div>
);
};
   

// Main App
export default function App() {
  const [elements, setElements] = useState([]);

  const handleDragEnd = ({ over, active }) => {
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    const isToolboxItem = isNaN(parseInt(activeId));

    if (overId === "canvas" && isToolboxItem) {
      // Adding new element from toolbox
      setElements((prev) => [
        ...prev,
        {
          type: active.id,
          content: active.id === "button" ? "Click Me" : "",
          src: "",
          editing: active.id === "button",
        },
      ]);
    }else if (!isToolboxItem && !isNaN(parseInt(overId)) && activeId !== overId) {
      // Swapping elements inside canvas
      const oldIndex = parseInt(activeId);
      const newIndex = parseInt(overId);
      setElements((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleTextChange = (index, value) => {
    const updated = [...elements];
    updated[index].content = value;
    setElements(updated);
  };

  const handleImageChange = (index, url) => {
    const updated = [...elements];
    updated[index].src = url;
    setElements(updated);
  };

  const handleDelete = (index) => {
    setElements((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen">
        <div className="w-1/4 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Toolbox</h2>
          {["text", "image", "button"].map((id) => (
            <DraggableItem key={id} id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} />
          ))}
        </div>
        <Canvas
          elements={elements}
          setElements={setElements}
          onTextChange={handleTextChange}
          onImageChange={handleImageChange}
          onDelete={handleDelete}
        />
      </div>
    </DndContext>
  );
}
