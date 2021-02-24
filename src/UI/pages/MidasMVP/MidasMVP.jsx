/* global pywebview */
import * as React from "react";
const { useState } = React;
import "./MidasMVP.scss";

export default function MidasMVP() {
  const [sourceImage, setSourceImage] = useState("");
  const [depthImage, setDepthImage] = useState("");

  function handleFileUpload(e) {
    const file = e.target.files[e.target.files.length - 1];
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.addEventListener("load", () => {
      setSourceImage(fr.result.toString());
    });
  }

  function calculateDepth() {
    if (!sourceImage) return;
    pywebview.api.find_depth(sourceImage).then((depth) => {
      console.log("returned", depth);
      setDepthImage(depth);
    });
  }

  return (
    <section className="MidasMVP">
      <h1>Midas</h1>
      <div className="images">
        <img src={sourceImage} />
        <img src={depthImage} />
      </div>

      <div className="tab-bar">
        <input type="file" onChange={handleFileUpload} />
        <button onClick={calculateDepth}>Show Depth</button>
      </div>
    </section>
  );
}
