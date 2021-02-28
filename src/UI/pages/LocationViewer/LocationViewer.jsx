import React from "react";
const { useState } = React;

import "./LocationViewer.scss";

import { Save } from "react-feather";
import Overlay from "./components/Overlay";

// Would fetch this from the server
import panorama from "../../assets/example-pano.jpg";

export default function LocationViewer() {
  const [overlays, setOverlays] = useState([]);

  function addOverlay(e) {
    const position = { x: e.clientX, y: e.clientY };
    setOverlays([...overlays, position]);
  }

  function deleteOverlay(i) {
    setOverlays((o) => o.filter((_, index) => index !== i));
  }

  return (
    <article className="LocationViewer">
      <nav>
        <h1>Location Title</h1>
        <button className="wrapper">
          <Save />
        </button>
      </nav>
      <div className="content">
        <div style={{ position: "relative" }}>
          <img src={panorama} alt="panorama" onClick={addOverlay} />
          {overlays.map((data, key) => (
            <Overlay key={key} {...data} onDelete={() => deleteOverlay(key)} />
          ))}
        </div>
      </div>
    </article>
  );
}
