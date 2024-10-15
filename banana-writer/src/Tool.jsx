import {useState,useEffect,useRef} from 'react';
import { FaBold, FaVideo } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
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
import { BsBlockquoteLeft, BsBorderLeft } from "react-icons/bs";
import { RiSeparator } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { FaImage } from "react-icons/fa";
import { IoMdMusicalNotes } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaFileVideo } from "react-icons/fa";




const handleTextFormat = (tag) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const parentElement = range.commonAncestorContainer.parentNode;

  if (parentElement.tagName.toLowerCase() === tag.toLowerCase()) {
    const fragment = document.createDocumentFragment();
    while (parentElement.firstChild) {
      fragment.appendChild(parentElement.firstChild);
    }
    parentElement.parentNode.replaceChild(fragment, parentElement);
  } else {
    const selectedText = range.extractContents();
    const element = document.createElement(tag);
    element.appendChild(selectedText);
    range.insertNode(element);
  }

  selection.removeAllRanges();
  selection.addRange(range);
};


const alignText = (align) => {
    // document.execCommand("justify" + align); // Deprecated
  
    // Modern alternative:
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer.parentNode;
  
      if (container) {
        container.style.textAlign = align; // "left", "right", "center", "justify"
      }
    }
  };
  

const applyFormatting = (tagName, styles = {}) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText) {
        const selectedNode =
          range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer;

        // Toggle between applying and removing the format
        if (selectedNode.nodeName === tagName.toUpperCase()) {
          const parent = selectedNode.parentNode;
          while (selectedNode.firstChild) {
            parent.insertBefore(selectedNode.firstChild, selectedNode);
          }
          parent.removeChild(selectedNode);
        } else {
          const element = document.createElement(tagName);
          Object.assign(element.style, styles); // Apply any styles if passed
          element.textContent = selectedText;
          range.deleteContents();
          range.insertNode(element);
        }
      }
    }
  };
  
const BoldTag = () => {

    return (
      <button className="tool" title='bold' onClick={() => handleTextFormat("b")}>
      <FaBold size={12} />
    </button>
    );
};

const ItalicTag = () => {
    return (<button className="tool" onClick={() => handleTextFormat("i")}>
    <FaItalic size={12} />
  </button>)
  }

  const UnderlineTag = () => {
    return (<button className="tool" onClick={() => handleTextFormat("u")}>
    <FaUnderline size={12} />
  </button>)
  }

  const BgPickerTag = () => {
    
    const textBgPicker = useRef();
    const toggleTextBgPicker = () => {
        textBgPicker.current.click();
        const color = textBgPicker.current.value;
        formatColor("hiliteColor", color);
      };

    return(<><button className="tool" onClick={toggleTextBgPicker}>
      <FaFillDrip size={12} />
    </button><input type="color" style={{ display: "none" }} ref={textBgPicker} /></>)
  }

  const ColorPickerTag = () => {
    const colorPickerRef = useRef();
    const toggleColorPicker = () => {
      colorPickerRef.current.click();
      const color = colorPickerRef.current.value;
      console.log(color);
  
      formatColor("foreColor", color);
    };
    return (
      <>
        <button className="tool" onClick={toggleColorPicker}>
            <MdFormatColorText size={12} />
          </button>
          <input
            type="color"
            style={{ display: "none" }}
            ref={colorPickerRef}
          />
      </>
    )
  }

  const LinkTag = ({setLinkBoxVisible}) => {
    const linkInputRef = useRef();
    const [isLinkToolVisible, setLinkToolVisible] = useState(false);
    const [linkValue, setLinkValue] = useState("");
    const [selection, setSelection] = useState("");
    const [linkPosition, setLinkPosition] = useState({ top: 0, left: 0 });
    const toggleLinkTool = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange(); // Clone the first range
        const rect = range.getBoundingClientRect();
        setLinkPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
        setSelection(range); // Store the cloned range
        setLinkToolVisible(true); // Show the link input only if there is a selection
      } else {
        setLinkToolVisible(false); // Hide if selection is empty
      }
      setLinkBoxVisible(!isLinkToolVisible);
    };
    const handleDocumentClick = (e) => {
      // Check if the clicked element is outside the link input box and the link button
      if (
        linkInputRef.current &&
        !linkInputRef.current.contains(e.target) &&
        !e.target.closest(".link-button")
      ) {
        setLinkToolVisible(false); // Hide the link input box
      }
    };
    const formatLink = (value, selection) => {
      const linkElement = document.createElement("a");
      linkElement.href = value;
      linkElement.textContent = selection.toString();
      linkElement.target = "_blank";
  
      selection.deleteContents();
      selection.insertNode(linkElement);
    };
    useEffect(() => {
      document.addEventListener("click", handleDocumentClick);
  
      // Cleanup the event listener on component unmount
      return () => {
        document.removeEventListener("click", handleDocumentClick);
      };
    }, []);
    const handleSaveLink = () => {
      formatLink(linkValue, selection);
      setLinkValue("");
      setLinkToolVisible(false); 
      setLinkBoxVisible(false); 
    };
  
  
    return (
      <>
      {isLinkToolVisible && (
        <div
          style={{
            position: "absolute",
            top: linkPosition.top,
            left: linkPosition.left,
          }}
          ref={linkInputRef}
        >
          <input
            type="text"
            style={{ border: "1px solid #ccc" }}
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)} // Set link input value
            placeholder="Enter link URL"
          />
          <button onClick={handleSaveLink}>Save</button>
        </div>
      )}<button
            className="tool link-button"
            onClick={() => {
              // setSelection(window.getSelection());
              toggleLinkTool();
            }}
          >
            <FaLink size={12} />
          </button>
      </>
      
    )
  }

  const AlignLeftTag = () => {
    return (
      <button className="tool" onClick={() => alignText("left")}>
            <FaAlignLeft size={12} />
          </button>
    )
  }

  const AlignCenterTag = () => {
    return(
      <button className="tool" onClick={() => alignText("center")}>
            <FaAlignCenter size={12} />
          </button>
    )
  }

  const AlignJustifyTag = () => {
    return <button className="tool" onClick={() => alignText("justify")}>
    <FaAlignJustify size={12} />
  </button>
  } 

  const AlignRightTag = () => {
    return <button className="tool" onClick={() => alignText("right")}>
    <FaAlignRight size={12} />
  </button>
  }

  const BlockQouteTag = () => {
    const formatAsBlockquote = () => applyFormatting("blockquote",{marginLeft:0,paddingLeft:"12px",borderLeft:"3px solid #333"});
    return <button className="tool" onClick={formatAsBlockquote}>
    <BsBlockquoteLeft size={14} />
  </button>
  }

  const FontSizeTag = () => {

    return <select
    className="tool"
    onChange={(e) => formatFontSize(e.target.value)}
  >
    <option value="">Text</option>
    <option value="34px">Heading 1</option>
    <option value="30px">Heading 2</option>
    <option value="24px">Heading 3</option>
  </select>
  }

  const CodeTag = () => {
    const formatAsCode = () => applyFormatting("code",{backgroundColor:"#f9f9f9",padding:"8px",border:".1px solid #808080",borderRadius:"2px",display:"block"});
   
    return <button className="tool" onClick={formatAsCode}>
    <FaCode size={14} />
  </button>
  }

  const SeparateTag = () => {
    const separate = () => {
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
    };
    return <button className="tool" onClick={separate} >
    <RiSeparator size={14} />
  </button>
  }

  const FontFamilyTag = () => {
   
    const applyFontFamily = (fontFamily) =>
      applyFormatting("span", { fontFamily });
  
    return <select
    className="tool"
    onChange={(e) => applyFontFamily(e.target.value)}
  >
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
  }

  const RemoveTag = () => {
    const formatRemove = () => {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
    
      const range = selection.getRangeAt(0);
      const parentElement = range.commonAncestorContainer.parentNode;
    
      // Check if the selected text is within an inline formatting element (like <b>, <i>, <u>)
      const inlineTags = ["b", "i", "u", "span"]; // Add other tags as necessary
      if (inlineTags.includes(parentElement.tagName.toLowerCase())) {
        // Remove the formatting by replacing the parent element with its child nodes
        const fragment = document.createDocumentFragment();
        while (parentElement.firstChild) {
          fragment.appendChild(parentElement.firstChild);
        }
        parentElement.parentNode.replaceChild(fragment, parentElement);
      } else {
        // If the parent doesn't have an inline tag, walk through the children and remove formatting
        const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_ELEMENT, {
          acceptNode: (node) => (inlineTags.includes(node.tagName.toLowerCase()) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
        });
    
        const nodesToRemove = [];
        while (walker.nextNode()) {
          nodesToRemove.push(walker.currentNode);
        }
    
        // Remove inline elements while preserving the text content
        nodesToRemove.forEach((node) => {
          const fragment = document.createDocumentFragment();
          while (node.firstChild) {
            fragment.appendChild(node.firstChild);
          }
          node.parentNode.replaceChild(fragment, node);
        });
      }
    };
    return <button className="tool" onClick={formatRemove}>
    <ImClearFormatting size={12} />
  </button>
  }

  const FileTag = () => {
    const imgInputRef = useRef();

    const handleFileInsert = (file) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        let element;
  
        switch (file.type.split("/")[0]) {
          case "image":
            element = document.createElement("img");
            element.src = reader.result;
            element.style.maxWidth = "100%";
            break;
          case "video":
            element = document.createElement("video");
            element.src = reader.result;
            element.controls = true;
            element.style.maxWidth = "100%";
            break;
          case "audio":
            element = document.createElement("audio");
            element.src = reader.result;
            element.controls = true;
            break;
          case "application":
            element = document.createElement("a");
            element.href = reader.result;
            element.textContent = `Download ${file.name}`;
            element.download = file.name;
            break;
          default:
            element = document.createElement("p");
            element.textContent = `Unknown file type: ${file.type}`;
        }
  
        insertElementAtSelection(element);
      };
  
      reader.readAsDataURL(file);
    };
    const insertElementAtSelection = (element) => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.collapse(false);
        range.insertNode(element);
      }
    };

    const toggleImgInput = () => {
      imgInputRef.current.click();
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      handleFileInsert(file);
    };
  
    return <>
      <input
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            ref={imgInputRef}
          />
          <button className="tool" onClick={toggleImgInput}>
            <div>
              <i>
                <FaFile />
              </i>
            </div>
          </button>
    </>
  }

export { BoldTag, ItalicTag,UnderlineTag,FileTag,BgPickerTag,ColorPickerTag,LinkTag,AlignCenterTag,AlignJustifyTag,AlignLeftTag,AlignRightTag,FontSizeTag,FontFamilyTag,BlockQouteTag,CodeTag,RemoveTag,SeparateTag };
