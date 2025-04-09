import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Toolbox item
const DraggableItem = ({ id, label }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id });
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

// Canvas droppable area
const CanvasWrapper = ({ children }) => {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  return (
    <div ref={setNodeRef} id="canvas" className="flex-1 min-h-screen p-4 border bg-gray-50">
      <h2 className="text-lg font-bold mb-4">Canvas</h2>
      {children}
    </div>
  );
};

// Canvas Item with sorting
const SortableCanvasItem = ({ el, index, onTextChange, onImageChange, onDelete, setElements }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(index, url);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 my-2 border bg-white rounded shadow relative"
    >
      {el.type === "text" && (
        <div>
          <input
            type="text"
            value={el.content}
            onChange={(e) => onTextChange(index, e.target.value)}
            placeholder="Enter text"
            className="w-full p-1 border rounded"
            draggable={false}
          />
          <DeleteButton onClick={() => onDelete(index)} />
        </div>
      )}

      {el.type === "image" && (
        el.src ? (
          <div>
            <img
              src={el.src}
              alt="Uploaded"
              className="max-w-full h-auto rounded"
              draggable={false}
            />
            <DeleteButton onClick={() => onDelete(index)} />
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block"
          />
        )
      )}

      {el.type === "button" && (
        <div>
          {el.editing ? (
            <input
              type="text"
              value={el.content}
              onChange={(e) => onTextChange(index, e.target.value)}
              onBlur={() => {
                const updated = [...setElements];
                updated[index].editing = false;
                setElements(updated);
              }}
              placeholder="Enter button text"
              className="w-full p-1 border rounded text-black"
              autoFocus
              draggable={false}
            />
          ) : (
            <button
              onClick={() => {
                const updated = [...setElements];
                updated[index].editing = true;
                setElements(updated);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              draggable={false}
            >
              {el.content.trim() || "Click Me"}
            </button>
          )}
          <DeleteButton onClick={() => onDelete(index)} />
        </div>
      )}
    </div>
  );
};

const DeleteButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
  >
    ✕
  </button>
);

// Main App
export default function App() {
  const [elements, setElements] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const isToolboxItem = activeId.startsWith("toolbox-");

    if (overId === "canvas" && isToolboxItem) {
      // Add new component from toolbox
      const type = activeId.replace("toolbox-", "");
      setElements((prev) => [
        ...prev,
        {
          type, 
          content: type === "button" ? "Click Me" : "",
          src: "",
          editing:  type === "button",
        },
      ]);
    } else if (!isToolboxItem && activeId !== overId) {
      const oldIndex = parseInt(activeId);
      const newIndex = parseInt(overId);
      setElements((prev) => arrayMove(prev, oldIndex, newIndex));
    }

    setActiveId(null);
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-screen">
        <div className="w-1/4 bg-gray-100 p-4">
          <h2 className="text-lg font-bold mb-4">Toolbox</h2>
          {["text", "image", "button"].map((id) => (
            <DraggableItem
              key={`toolbox-${id}`}
              id={`toolbox-${id}`}
              label={id.charAt(0).toUpperCase() + id.slice(1)}
            />
          ))}
        </div>
        
          <CanvasWrapper>
          <SortableContext items={elements.map((_, i) => i.toString())}>
            {elements.map((el, index) => (
              <SortableCanvasItem
                key={index}
                el={el}
                index={index}
                onTextChange={handleTextChange}
                onImageChange={handleImageChange}
                onDelete={handleDelete}
                setElements={setElements}
              />
            ))}
          </SortableContext>
          </CanvasWrapper>
        </div>
    
      <DragOverlay>
        {activeId && !activeId.includes("canvas") && (
          <div className="p-2 m-2 border bg-white rounded shadow">
            {activeId.replace("toolbox-", "")}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
