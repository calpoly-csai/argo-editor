/* global pywebview */
import * as React from "react";
const { useState, useEffect, useRef } = React;
import "./MidasMVP.scss";

export default function MidasMVP() {
  const [sourceImage, setSourceImage] = useState(null);
  const [depthImage, setDepthImage] = useState(null);

  function handleFileUpload(e) {
    const file = e.target.files[e.target.files.length - 1];
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.addEventListener("load", () => {
      setSourceImage(fr.result.toString());
    });
  }

  function calculateDepth() {
    console.log(pywebview.api.find_depth);

    pywebview.api.find_depth(sourceImage).then((depth) => {
      console.log("returned", depth);
      setDepthImage(depth);
    });
  }

  return (
    <section>
      <h1>Midas</h1>
      <input type="file" onChange={handleFileUpload} />
      <img src={sourceImage} />
      <img src={depthImage} />
      <button onClick={calculateDepth}>Show Depth</button>
    </section>
  );
}
