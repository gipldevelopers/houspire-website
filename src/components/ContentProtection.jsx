"use client";

import { useEffect } from "react";

const BLOCKED_SHORTCUTS = new Set(["s", "u"]);

export function ContentProtection() {
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const preventImageDrag = (event) => {
      if (event.target instanceof HTMLElement && event.target.closest("img")) {
        event.preventDefault();
      }
    };

    const preventProtectedShortcuts = (event) => {
      const key = event.key.toLowerCase();
      const isSaveOrViewSource = (event.ctrlKey || event.metaKey) && BLOCKED_SHORTCUTS.has(key);
      const isDevToolsShortcut =
        key === "f12" ||
        ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));

      if (isSaveOrViewSource || isDevToolsShortcut) {
        event.preventDefault();
      }
    };

    const markImagesAsNonDraggable = () => {
      document.querySelectorAll("img").forEach((image) => {
        image.setAttribute("draggable", "false");
      });
    };

    markImagesAsNonDraggable();

    const observer = new MutationObserver(() => {
      markImagesAsNonDraggable();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventImageDrag);
    document.addEventListener("keydown", preventProtectedShortcuts);

    return () => {
      observer.disconnect();
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventImageDrag);
      document.removeEventListener("keydown", preventProtectedShortcuts);
    };
  }, []);

  return null;
}
