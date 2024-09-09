import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from '@codemirror/lang-javascript';
import { xcodeLight, xcodeDark } from '@uiw/codemirror-theme-xcode';
function App() {
  const [value, setValue] = React.useState("console.log('hello world!');");
  const onChange = React.useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  return <CodeMirror value={value} height="200px" theme={xcodeDark} extensions={[javascript({ jsx: true })]} onChange={onChange} />;
}
export default App;
