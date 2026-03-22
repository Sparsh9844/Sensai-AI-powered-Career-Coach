"use client";

import { useState, useCallback } from "react";

let toastId = 0;
const listeners = new Set();
let toasts = [];

function dispatch(action) {
  switch (action.type) {
    case "ADD":
      toasts = [action.toast, ...toasts].slice(0, 5);
      break;
    case "REMOVE":
      toasts = toasts.filter((t) => t.id !== action.id);
      break;
    case "DISMISS":
      toasts = toasts.map((t) =>
        t.id === action.id ? { ...t, open: false } : t
      );
      break;
  }
  listeners.forEach((l) => l([...toasts]));
}

export function toast({ title, description, variant = "default" }) {
  const id = ++toastId;
  dispatch({
    type: "ADD",
    toast: { id, title, description, variant, open: true },
  });
  setTimeout(() => dispatch({ type: "REMOVE", id }), 4500);
  return id;
}

export function useToast() {
  const [state, setState] = useState([...toasts]);

  useState(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  });

  return {
    toasts: state,
    toast,
    dismiss: (id) => dispatch({ type: "DISMISS", id }),
  };
}
