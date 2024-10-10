import { useRef, useState, useEffect, useCallback } from "react";
// import axios from "axios"; // Import axios for your API call
import "./TextEditor.css";
import Toolbar from "./Toolbar";

const TextEditor = ({ noteToOpen, setNoteToDisplay }) => {
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);
  const [toolbarPosition, setToolbarPosition] = useState({
    display: "none",
    top: 0,
    left: 0,
  });

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const execCommand = (command, value = null) => {
    
    if (document.queryCommandSupported(command)) {
      document.execCommand(command, false, value);
    } else {
      console.error(`${command} is not supported`);
    }
  };
  
  const handleSelectionChange = () => {
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedText = selection.toString();
      const parentElement = range.startContainer.parentElement;
  
      if (
        selectedText.trim() !== "" &&
        editorRef.current.contains(parentElement)
      ) {
        setToolbarPosition({
          display: "flex",
          top: rect.top + window.scrollY - 50,
          left: rect.left + window.scrollX,
        });
      } else if (!isDropdownVisible) {
        setToolbarPosition({
          display: "none",
          top: 0,
          left: 0,
        });
      }
    } else if (!isDropdownVisible) {
      setToolbarPosition({
        display: "none",
        top: 0,
        left: 0,
      });
    }
  };
  

  useEffect(() => {
    if (noteToOpen) {
      setTitle(noteToOpen.title);
      editorRef.current.innerHTML = noteToOpen.content;
    }
  }, [noteToOpen]);

  const handleKeyDown = useCallback(
    async (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        try {
          console.log(editorRef.current.innerHTML);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [noteToOpen, setNoteToDisplay, title]
  );

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="text-editor" onMouseUp={handleSelectionChange}>
      <Toolbar
        execCommand={execCommand}
        position={toolbarPosition}
        setDropdownVisible={setDropdownVisible} // Pass state setter
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          border: 0,
          outline: "none",
          width: "100%",
          fontSize: 32,
          background: "none",
          color: "inherit",
        }}
      />
      <br />
      <div
        ref={editorRef}
        className="editor"
        contentEditable
        suppressContentEditableWarning
        placeholder="Compose something amazing..."
      ></div>
    </div>
  );
};

export default TextEditor;
