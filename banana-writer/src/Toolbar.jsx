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
  const [isLinkToolVisible, setLinkToolVisible] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [selection,setSelection] = useState("");
  const [linkPosition, setLinkPosition] = useState({ top: 0, left: 0 });
  const colorPickerRef = useRef();
  const textBgPicker = useRef();
  const imgInputRef = useRef();
  const linkInputRef = useRef(); // Reference for the link input box

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
  };

  const toggleTextBgPicker = () => {
    textBgPicker.current.click();
    const color = textBgPicker.current.value;
    execCommand("hiliteColor", color);
  };

  const toggleOtherTool = () => {
    setOtherToolVisible(!isOtherToolVisible);
    setDropdownVisible(!isOtherToolVisible);
  };

  const toggleFontSizeTool = () => {
    setFontSizeToolVisible(!isFontSizeToolVisible);
    setDropdownVisible(!isFontSizeToolVisible);
  };

  const toggleLinkTool = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0).cloneRange(); // Clone the first range
      const rect = range.getBoundingClientRect();
      setLinkPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
      setSelection(range); // Store the cloned range
      setLinkToolVisible(true); // Show the link input only if there is a selection
    } else {
      setLinkToolVisible(false); // Hide if selection is empty
    }
    setDropdownVisible(!isLinkToolVisible);
  };
  

  const handleDocumentClick = (e) => {
    // Check if the clicked element is outside the link input box and the link button
    if (linkInputRef.current && !linkInputRef.current.contains(e.target) && !e.target.closest(".link-button")) {
      setLinkToolVisible(false); // Hide the link input box
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const toggleImgInput = () => {
    imgInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    execCommand("file", file);
  };

  const handleSaveLink = () => {
    execCommand("link", "", linkValue,selection);
    setLinkValue(""); // Clear input after saving
    setLinkToolVisible(false); // Hide the link input
    setDropdownVisible(false); // Hide the dropdown
  };

  return (
    <>
      {isLinkToolVisible && (
        <div style={{ position: "absolute", top: linkPosition.top, left: linkPosition.left }} ref={linkInputRef}>
          <input
            type="text"
            style={{ border: "1px solid #ccc" }}
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)} // Set link input value
            placeholder="Enter link URL"
          />
          <button onClick={handleSaveLink}>Save</button>
        </div>
      )}
      <div style={toolbarStyle} className="toolbar">
        <ul className="toolbar-list">
          <button className="tool" onClick={() => execCommand("bold")}>
            <FaBold size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("italic")}>
            <FaItalic size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("underline")}>
            <FaUnderline size={12} />
          </button>
          <button className="tool" onClick={toggleTextBgPicker}>
            <FaFillDrip size={12} />
          </button>
          <input type="color" style={{ display: "none" }} ref={textBgPicker} />
          <button className="tool" onClick={toggleColorPicker}>
            <MdFormatColorText size={12} />
          </button>
          <input type="color" style={{ display: "none" }} ref={colorPickerRef} />
          <button className="tool link-button" onClick={()=>{
            // setSelection(window.getSelection());
            toggleLinkTool()
            }}>
            <FaLink size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("justifyLeft")}>
            <FaAlignLeft size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("justifyCenter")}>
            <FaAlignCenter size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("justifyFull")}>
            <FaAlignJustify size={12} />
          </button>
          <button className="tool" onClick={() => execCommand("justifyRight")}>
            <FaAlignRight size={12} />
          </button>
          <button className="tool" onClick={toggleFontSizeTool} style={{ position: "relative" }}>
            <span style={{ marginRight: "5px" }}>Text</span>
            <IoIosArrowDown size={12} style={{ cursor: "pointer" }} />
            {isFontSizeToolVisible && (
              <ul className="font-size-tool">
                <li onClick={() => execCommand("formatBlock", "<h3>")}>
                  <div>
                    <h3>Heading 1</h3>
                  </div>
                </li>
                <li onClick={() => execCommand("formatBlock", "<h4>")}>
                  <div>
                    <h4>Heading 2</h4>
                  </div>
                </li>
                <li onClick={() => execCommand("formatBlock", "<h5>")}>
                  <div>
                    <h5>Heading 3</h5>
                  </div>
                </li>
                <li onClick={() => execCommand("formatBlock", "<p>")}>
                  <div>
                    <p>Paragraph</p>
                  </div>
                </li>
              </ul>
            )}
          </button>
          <button className="tool" onClick={() => execCommand("quote")}>
            <BsBlockquoteLeft size={14} />
          </button>
          <button className="tool" onClick={() => execCommand("code")}>
            <FaCode size={14} />
          </button>
          <button className="tool" onClick={() => execCommand("separator")}>
            <RiSeparator size={14} />
          </button>
          <select className="tool" onChange={(e) => execCommand("fontfamily", "", e.target.value)}>
            <option value="sans-serif" style={{ fontFamily: "sans-serif" }}>
              Sans Serif
            </option>
            <option value="serif" style={{ fontFamily: "serif" }}>
              Serif
            </option>
            <option value="monospace" style={{ fontFamily: "monospace" }}>
              Monospace
            </option>
          </select>
          <input type="file" onChange={handleImageChange} style={{ display: "none" }} ref={imgInputRef} />
          <button className="tool" onClick={toggleImgInput}>
            <div>
              <i>
                <FaVideo />
              </i>
            </div>
          </button>
          <button className="tool" onClick={() => execCommand("removeFormat")}>
            <ImClearFormatting size={12} />
          </button>
        </ul>
      </div>
    </>
  );
}

export default Toolbar;
