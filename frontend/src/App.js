import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ImageEditor from "./components/ImageEditor";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ImageEditor />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;