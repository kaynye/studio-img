import React from "react";
import "./App.css";
import ImageEditor from "./components/ImageEditor";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <ImageEditor />
      <Toaster />
    </div>
  );
}

export default App;