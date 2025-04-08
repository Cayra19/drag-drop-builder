import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

// Draggable item used in the toolbox
function DraggableItem({ id, label }) {
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
}

// Canvas where elements get dropped
function Canvas({ elements, onTextChange, onImageChange, onDelete }) {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(index, url);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-h-screen p-4 border bg-gray-50"
    >
      <h2 className="text-lg font-bold mb-4">Canvas</h2>
      {elements.map((el, index) => (
        <div
          key={index}
          className="p-2 my-2 border bg-white rounded shadow"
        >
          {el.type === 'text' && (
            <input
              type="text"
              value={el.content || ''}
              onChange={(e) => onTextChange(index, e.target.value)}
              placeholder="Enter text"
              className="w-full p-1 border rounded"
            />
          )}
          {el.type === 'image' && (
            <>
            {el.src ? (
              <div className="relative">
                <img src={el.src} alt="Uploaded" className="max-w-full h-auto rounded" />
                <button
                  onClick={() => onDelete(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                >
                  ✕
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
              />
            )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// Main App Component
export default function App() {
  const [elements, setElements] = useState([]);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over?.id === 'canvas') {
      setElements((prev) => [
        ...prev,
        { type: active.id, content: '', src: '' },
      ]);
    }
  };

  const handleTextChange = (index, value) => {
    const newElements = [...elements];
    newElements[index].content = value;
    setElements(newElements);
  };

  const handleImageChange = (index, url) => {
    const newElements = [...elements];
    newElements[index].src = url;
    setElements(newElements);
  };

  const handleDelete = (index) => {
    setElements((prev) => prev.filter((_, i) => i !== index));
  };
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen">
        <div className="w-1/4 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Toolbox</h2>
          <DraggableItem id="text" label="Text" />
          <DraggableItem id="image" label="Image" />
        </div>
        <Canvas
          elements={elements}
          onTextChange={handleTextChange}
          onImageChange={handleImageChange}
          onDelete={handleDelete}
        />
      </div>
    </DndContext>
  );
}
