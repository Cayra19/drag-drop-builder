# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Video Link
https://drive.google.com/file/d/1qxAaLYebXG5AXwD1IpdZVTWuYsAV9224/view?usp=sharing

# Objective

Transform the existing form-based website builder into a drag-and-drop interface, enabling users to have more control over their website design.

# Architecture Overview

• Component-Based Design:
The app is built using a modular, component-based architecture with React. Each element on the canvas (text, image, button) is encapsulated as a reusable component.

• State Management:
State is managed using React’s useState hooks. The canvas tracks a list of dropped elements (elements) and the currently dragged item (activeId).

• Drag-and-Drop Logic:
The drag-and-drop functionality is powered by @dnd-kit, enabling:
o Dragging items from the toolbox.
o Dropping items onto the canvas.
o Reordering items on the canvas.

• Conditional Rendering:
Elements switch between “edit” and “preview” modes.
Eg:- buttons can be clicked to edit the label and switched back to a styled button.


# Tools and Libraries Used
Tool / Library Purpose
**React Core** framework for building UI
**@dnd-kit Drag-and-drop** library for flexible, accessible interactions
**TailwindCSS** Utility-first CSS framework for fast styling
**JavaScript (ES6+)** Language for building component logic
**Vite** (Depending on setup) Local development environment


# Features Implemented
• Toolbox with Draggable Elements – text, image, button.
• Canvas with Droppable + Sortable Area – supports drag-in and drag-to-reorder.
• Component Editing – form-based inline editing of text or buttons.
• Image Upload Support – allows users to select images from their device.
• Delete Functionality – remove components from canvas easily.
• Visual Feedback During Drag – via DragOverlay.

# Rationale Behind Decisions
• React + @dnd-kit:
Provides a modern, declarative way to manage UI state and DOM interactions.
@dnd-kit is lightweight, accessible, and more customizable than alternatives like react-beautiful-dnd.

• TailwindCSS:
Rapidly builds responsive and clean interfaces without writing long custom CSS.

• Separation of Concerns:
Toolbox, canvas, and canvas elements are clearly separated, making the app easier to scale and maintain.
• Form-based Configurability:
Retains the familiar form-based editing flow from the legacy system, while improving flexibility via drag-and-drop.


# Future expansions
• Code structure allows for easily adding new components like videos, maps, or forms.
• Can integrate global state management (e.g., Redux) if app complexity grows.
• Future possibility to add saving/loading functionality, templates, and mobile editing mode.

