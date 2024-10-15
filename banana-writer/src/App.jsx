import React from 'react';
import TextEditor from './TextEditor';

const App = () => {
  return <TextEditor 
  tools={['bold', 'italic', 'underline','link']}
  theme="light"/>
}

export default App;
