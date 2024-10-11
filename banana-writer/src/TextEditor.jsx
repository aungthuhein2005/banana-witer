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
  
  const execCommand = (command,file) => {
    if (command === "code") {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
  
        if (selectedText) {
          const selectedNode = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer;
  
          // Toggle <code> tag
          if (selectedNode.nodeName === "CODE") {
            const parent = selectedNode.parentNode;
            while (selectedNode.firstChild) {
              parent.insertBefore(selectedNode.firstChild, selectedNode);
            }
            parent.removeChild(selectedNode);
          } else {
            const codeElement = document.createElement("code");
            codeElement.textContent = selectedText;
            range.deleteContents();
            range.insertNode(codeElement); // Insert <code> tag
          }
        }
      }
    }else if (command === "quote") {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
  
        if (selectedText) {
          const selectedNode = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer;
  
          // Toggle <blockquote> tag
          if (selectedNode.nodeName === "BLOCKQUOTE") {
            const parent = selectedNode.parentNode;
            while (selectedNode.firstChild) {
              parent.insertBefore(selectedNode.firstChild, selectedNode);
            }
            parent.removeChild(selectedNode); // Remove <blockquote> tag
          } else {
            const blockquoteElement = document.createElement("blockquote");
            blockquoteElement.textContent = selectedText;
            range.deleteContents();
            range.insertNode(blockquoteElement); // Insert <blockquote> tag
          }
        }
      }
    }else  if (command === "separator") {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Create a horizontal rule
      const hrElement = document.createElement("hr");
      
      // Move the range to the end of the selection
      range.collapse(false); // Collapse the range to the end (false means the end)
      range.insertNode(hrElement); // Insert <hr> element at the end of the selection

      // Optionally, move the cursor after the inserted <hr> element
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    }else if (command === "image" && file) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (file) {
          const reader = new FileReader();
          // console.log(reader.result);

          reader.onloadend = () => {
            const imgElement = document.createElement("img");
            imgElement.src = reader.result; // Set the src to the result of FileReader
            imgElement.style.maxWidth = "100%"; // Optional: limit the image width

            range.collapse(false); // Collapse the range to the end (false means the end)
            range.insertNode(imgElement); // Insert the image element at the end of the selection
          };
          reader.readAsDataURL(file); 
      };
    }
    }  else {
      document.execCommand(command, false, null); // For other commands
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
