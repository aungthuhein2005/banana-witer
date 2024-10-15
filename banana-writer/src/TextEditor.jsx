import { useRef, useState, useEffect, useCallback } from "react";
// import axios from "axios"; // Import axios for your API call
import "./TextEditor.css";
import Toolbar from "./Toolbar";
import ToolbarTest from "./ToolbarTest";

const TextEditor = ({tools,theme,fixed=false}) => {
  const [title, setTitle] = useState("");
  const editorRef = useRef(null);

  return (
    <div className={`text-editor ${theme}`}>
      <Toolbar
        tools={tools}
        theme={theme}
        fixed={fixed}
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
