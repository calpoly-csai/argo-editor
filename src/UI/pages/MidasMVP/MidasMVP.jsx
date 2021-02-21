/* global pywebview */
import * as React from "react";
const { useState, useEffect, useRef } = React;
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

    pywebview.api.find_depth(sourceImage).then((depth) => {
      console.log("returned", depth);
      alert("Done!")
      setDepthImage(depth);
    });
  }

  return (
    <section className="MidasMVP">
      <h1>Midas</h1>
      <input type="file" onChange={handleFileUpload} />
      <img src={sourceImage} />
      <img src={depthImage} />
      <button onClick={calculateDepth}>Show Depth</button>
    </section>
  );
}
