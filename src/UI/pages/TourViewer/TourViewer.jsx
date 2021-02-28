import React from "react";

import "./TourViewer.scss";
import exampleTour from "../../assets/example-tour.json";
import Graph from "react-graph-vis";
import { useHistory } from "react-router-dom";

const locationList = Object.entries(exampleTour.locations);
const nodes = locationList.map(([loc, info]) => ({
  id: loc,
  label: info.title,
  title: info.title,
}));
const edges = locationList.flatMap(([loc, info]) => {
  const from = loc;
  const toList = info.overlays.flatMap((overlay) =>
    overlay.actions
      .filter((action) => action.type === "path")
      .map((path) => path.destination)
  );
  const edgeList = toList.flatMap((to) => ({ to, from }));
  return edgeList;
});

const graph = { nodes, edges };

const options = {
  layout: {
    hierarchical: true,
  },
  edges: {
    color: "#000000",
  },
  height: "500px",
};

export default function TourViewer() {
  const history = useHistory();

  const graphEvents = {
    select: function (event) {
      let { nodes, edges } = event;
      if (nodes.length) history.push("/location/" + nodes[0]);
    },
  };

  return (
    <article className="page TourViewer">
      <Graph graph={graph} options={options} events={graphEvents} />
    </article>
  );
}
