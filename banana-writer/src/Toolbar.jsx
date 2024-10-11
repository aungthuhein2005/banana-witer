import "./TextEditor.css";
import { FaBold, FaVideo } from "react-icons/fa6";
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
import { MdFormatColorText } from "react-icons/md";
import { FaCode } from "react-icons/fa6";
import { BsBlockquoteLeft } from "react-icons/bs";
import { RiSeparator } from "react-icons/ri";
import { useEffect, useRef, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { IoMdMusicalNotes } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";

function Toolbar({ position, execCommand, setDropdownVisible }) {
  const [isFontSizeToolVisible, setFontSizeToolVisible] = useState(false);
  const [isOtherToolVisible, setOtherToolVisible] = useState(false);
  const colorPickerRef = useRef();
  const textBgPicker = useRef();
  const imgInputRef = useRef();

  const toolbarStyle = {
    position: "absolute",
    top: position.top,
    left: position.left > 700 ? position.left - 700 : position.left - 20,
    display: position.display,
    padding: 5,
    borderRadius: 4,
  };

  const toggleColorPicker = () => {
    colorPickerRef.current.click();
    const color = colorPickerRef.current.value;
    execCommand("foreColor", color);
  }

  const toggleTextBgPicker = () => {
    colorPickerRef.current.click();
    const color = colorPickerRef.current.value;
    execCommand("hiliteColor", color);
  }

  const toggleOtherTool = () => {
    setOtherToolVisible(!isOtherToolVisible);
    setDropdownVisible(!isOtherToolVisible);
  }

  const toggleFontSizeTool = () => {
    setFontSizeToolVisible(!isFontSizeToolVisible);
    setDropdownVisible(!isFontSizeToolVisible);
  };

  const toggleImgInput = () => {
    imgInputRef.current.click();
    
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    execCommand("image",file)
  };

  return (
    <div style={toolbarStyle} className="toolbar">
      <ul className="toolbar-list">
        <button className="tool" onClick={() => execCommand("bold")}><FaBold size={12} /></button>
        <button className="tool" onClick={() => execCommand("italic")}><FaItalic size={12} /></button>
        <button className="tool" onClick={() => execCommand("underline")}><FaUnderline size={12} /></button>
        <button className="tool" onClick={toggleTextBgPicker}><FaFillDrip size={12} /></button>
        <input type="color" style={{ display: 'none' }} ref={textBgPicker} />
        <button className="tool" onClick={toggleColorPicker}><MdFormatColorText size={12} /></button>
        <input type="color" style={{ display: 'none' }} ref={colorPickerRef} />
        <button className="tool"><FaLink size={12} /></button>
        <button className="tool" onClick={() => execCommand("justifyLeft")}><FaAlignLeft size={12} /></button>
        <button className="tool" onClick={() => execCommand("justifyCenter")}><FaAlignCenter size={12} /></button>
        <button className="tool" onClick={() => execCommand("justifyFull")}><FaAlignJustify size={12} /></button>
        <button className="tool" onClick={() => execCommand("justifyRight")}><FaAlignRight size={12} /></button>
        <button className="tool" onClick={toggleFontSizeTool} style={{ position: 'relative' }}>
          <span style={{ marginRight: '5px' }}>Text</span>
          <IoIosArrowDown size={12} style={{ cursor: "pointer" }} />
          {isFontSizeToolVisible && (
            <ul className="font-size-tool">
              <li onClick={() => execCommand("formatBlock", "<h3>")}>
                <div><h3>Heading 1</h3></div>
              </li>
              <li onClick={() => execCommand("formatBlock", "<h4>")}>
                <div><h4>Heading 2</h4></div>
              </li>
              <li onClick={() => execCommand("formatBlock", "<h5>")}>
                <div><h5>Heading 3</h5></div>
              </li>
              <li onClick={() => execCommand("formatBlock", "<p>")}>
                <div><p>Paragraph</p></div>
              </li>
            </ul>
          )}
        </button>

        <button className="tool" onClick={() => execCommand("quote")}><BsBlockquoteLeft size={14} /></button>
        <button className="tool" onClick={() => execCommand("code")}><FaCode size={14} /></button>
        <button className="tool" onClick={() => execCommand("separator")}><RiSeparator size={14} /></button>
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={imgInputRef} />
              <button className="tool" onClick={toggleImgInput}>
                <div><i><FaImage /></i></div>
              </button>
        {/* <button className="tool" onClick={toggleOtherTool} style={{ position: 'relative' }}>
          <IoIosMore size={12} style={{ cursor: "pointer" }} />
          {isOtherToolVisible && (
            <ul className="file-tool">
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} ref={imgInputRef} />
              <li onClick={toggleImgInput}>
                <div><i><FaImage /></i> <span>Image</span></div>
              </li>
              <li onClick={() => execCommand("song")}>
                <div><i><IoMdMusicalNotes /></i> <span>Song</span></div>
              </li>
              <li onClick={() => execCommand("video")}>
                <div><i><FaVideo /></i> <span>Video</span></div>
              </li>
              <li onClick={() => execCommand("file")}>
                <div><i><FaFile /></i> <span>File</span></div>
              </li>
            </ul>
          )}
        </button> */}
        <button className="tool" onClick={() => execCommand("removeFormat")}><ImClearFormatting size={12} /></button>
      </ul>
    </div>
  );
}

export default Toolbar;
