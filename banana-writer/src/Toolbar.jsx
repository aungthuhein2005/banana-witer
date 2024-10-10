import "./TextEditor.css";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { FaPalette } from "react-icons/fa";
import { ImClearFormatting } from "react-icons/im";
import { FaFillDrip } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { FaAlignLeft } from "react-icons/fa";
import { FaAlignRight } from "react-icons/fa";
import { FaAlignCenter } from "react-icons/fa6";
import { FaAlignJustify } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useState } from "react";

function Toolbar({ position, execCommand,setDropdownVisible }) {
  const [isFontSizeToolVisible, setFontSizeToolVisible] = useState(false);

  const toolbarStyle = {
    position: "absolute",
    top: position.top,
    left: position.left > 700 ? position.left - 700 : position.left - 20,
    display: position.display,
    padding: 5,
    borderRadius: 4,
  };

  
  const toggleFontSizeTool = (e) => {
    setFontSizeToolVisible(!isFontSizeToolVisible);
    setDropdownVisible(!isFontSizeToolVisible); // Ensure this keeps the toolbar open
  };
  

  return (
    <div style={toolbarStyle} className="toolbar">
      <ul className="toolbar-list">
        <button className="tool" onClick={() =>execCommand("bold")}><FaBold size={12}  /></button>
        <button className="tool" onClick={() => execCommand("italic")}><FaItalic size={12}  /></button>
        <button className="tool" onClick={() => execCommand("underline")}><FaUnderline size={12}  /></button>
        <button className="tool"><FaFillDrip size={12} /></button>
        <button className="tool"><FaPalette size={12} /></button>
        <button className="tool"><FaLink size={12} /></button>
        <button className="tool"><FaAlignLeft size={12} /></button>
        <button className="tool"><FaAlignCenter size={12} /></button>
        <button className="tool"><FaAlignJustify size={12} /></button>
        <button className="tool"><FaAlignRight size={12} /></button>
        <button className="tool" onClick={toggleFontSizeTool} style={{ position: 'relative' }}>
          <span style={{ marginRight: '5px' }}>Text</span>
          <IoIosArrowDown size={12}  style={{ cursor: "pointer" }} />
          {isFontSizeToolVisible && (
            <ul className="font-size-tool">
              <li onClick={() => execCommand("formatBlock", "<h3>")}><button><h3>Heading 1</h3></button></li>
              <li onClick={() => execCommand("formatBlock", "<h4>")}><button><h4>Heading 2</h4></button></li>
              <li onClick={() => execCommand("formatBlock", "<h5>")}><button><h5>Heading 3</h5></button></li>
              <li onClick={() => execCommand("formatBlock", "<p>")}><button><p>Paragraph</p></button></li>
            </ul>
          )}
        </button>

        <button className="tool" onClick={()=>execCommand("removeFormat")}><ImClearFormatting size={12} onClick={() => execCommand("removeFormat")} /></button>
      </ul>
    </div>
  );
}

export default Toolbar;
