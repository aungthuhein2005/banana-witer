import "./TextEditor.css";
import { useState, useRef, useEffect } from "react";
import {
  BoldTag,
  ItalicTag,
  UnderlineTag,
  FileTag,
  BgPickerTag,
  ColorPickerTag,
  LinkTag,
  AlignCenterTag,
  AlignLeftTag,
  AlignJustifyTag,
  AlignRightTag,
  FontSizeTag,
  FontFamilyTag,
  BlockQouteTag,
  CodeTag,
  RemoveTag,
  SeparateTag,
} from "./Tool";

function Toolbar({ tools = [],theme,fixed,style,customClass = ""}) {
  const [isLinkBoxVisible, setLinkBoxVisible] = useState(false);
  const toolList = {
    bold: <BoldTag />,
    italic: <ItalicTag />,
    underline: <UnderlineTag />,
    file: <FileTag />,
    bgPicker: <BgPickerTag />,
    colorPicker: <ColorPickerTag />,
    link: <LinkTag setLinkBoxVisible={setLinkBoxVisible} />,
    alignCenter: <AlignCenterTag />,
    alignLeft: <AlignLeftTag />,
    alignJustify: <AlignJustifyTag />,
    alignRight: <AlignRightTag />,
    fontSize: <FontSizeTag />,
    fontFamily: <FontFamilyTag />,
    blockQuote: <BlockQouteTag />,
    code: <CodeTag />,
    remove: <RemoveTag />,
    separate: <SeparateTag />,
  };

  const [toolbarPosition, setToolbarPosition] = useState({
    display: "none",
    top: 0,
    left: 0,
  });
  


  const handleSelectionChange = () => {
    
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedText = selection.toString();
      if (
        selectedText.trim() !== "" ) {
        setToolbarPosition({
          display: "flex",
          top: rect.top + window.scrollY - 50, // Offset the toolbar 40px above the selected text
          left: rect.left + window.scrollX + 10, // Optional: Offset horizontally
        });
      } else if (!isLinkBoxVisible) {
        setToolbarPosition({
          display: "none",
          top: 0,
          left: 0,
        });
      }
    } else if (!isLinkBoxVisible) {
      setToolbarPosition({
        display: "none",
        top: 0,
        left: 0,
      });
    }
  };
  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [isLinkBoxVisible]);

  const toolbarStyle = {
    position: fixed ? "relative" : "absolute",
    top: fixed ? 0 : toolbarPosition.top,
    left: fixed ? 0 : toolbarPosition.left > 700 ? toolbarPosition.left - 700 : toolbarPosition.left - 20,
    display: fixed ? 'block' : toolbarPosition.display,
    padding: 5,
    borderRadius: 4,
    
    // background: "#f0f0f0", // Optional: Add some styling
    boxShadow: fixed && 'none',
    border : fixed && "1px solid #ccc",
    ...style
  };

  return (
    <div style={toolbarStyle} className={`toolbar ${theme} ${customClass}`}>
      <div className="toolbar-list">
        {tools.map((tool) => {
          return <div style={{display:'inline'}} key={tool}> 
          {toolList[tool]}
        </div>
        })}
      </div>
    </div>
  );
}

export default Toolbar;
