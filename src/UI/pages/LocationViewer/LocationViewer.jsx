import React, { useEffect } from "react";
const { useState, useRef } = React;

import NavBar from "../../components/NavBar/NavBar";

import "./LocationViewer.scss";
// Would fetch from server
import dexterMid from "../../assets/panoramas/dexterMid.JPG";
import dexterEdge from "../../assets/panoramas/dexterEdge.JPG";
import cotchettFront from "../../assets/panoramas/cotchettFront.JPG";
import cotchettHall from "../../assets/panoramas/cotchettHall.JPG";
import orfaleaOneil from "../../assets/panoramas/orfaleaOneil.JPG";
import { useLocation } from "react-router-dom";

import exampleTour from "../../assets/example-tour.json";

import { Save } from "react-feather";
import Overlay from "./components/Overlay";

const panoramas = {
  dexterEdge,
  dexterMid,
  cotchettFront,
  cotchettHall,
  orfaleaOneil,
};

// Would fetch this from the server

export default function LocationViewer() {
  const [overlays, setOverlays] = useState([]);
  const [depthMap, setDepthMap] = useState([]);
  const location = useLocation();
  const locationRef = useRef();
  const locParts = location.pathname.split("/");
  const panoId = locParts[locParts.length - 1];
  const locGraph = exampleTour.locations[panoId];

  function addOverlay(e) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const z = depthMap[Math.floor(y)][Math.floor(x)];
    console.log({ depth: z });
    const position = { x, y, z };
    setOverlays([...overlays, position]);
  }

  function deleteOverlay(i) {
    setOverlays((o) => o.filter((_, index) => index !== i));
  }

  useEffect(function getDepthMap() {
    if (!locationRef.current) return;
    locationRef.current.onload = () => {
      const b64Image = getBase64Image(locationRef.current);
      pywebview.api.find_depth(b64Image).then((depth) => {
        console.log(depth);
        setDepthMap(depth);
      });
    };
  }, []);

  return (
    <article className="LocationViewer">
      <NavBar title={locGraph.title}>
        <button className="wrapper">
          <Save />
        </button>
      </NavBar>
      <div className="content">
        <img
          src={panoramas[panoId]}
          alt="panorama"
          onClick={addOverlay}
          ref={locationRef}
        />
        {overlays.map((data, key) => (
          <Overlay key={key} {...data} onDelete={() => deleteOverlay(key)} />
        ))}
      </div>
    </article>
  );
}

/**
 * Gets content of image element as base64 string
 * @param {HTMLImageElement} img
 * @return base64 string
 */
function getBase64Image(img) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL();
}
