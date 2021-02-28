import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Tours from "./pages/Tours/Tours";
import TourViewer from "./pages/TourViewer/TourViewer";
import LocationViewer from "./pages/LocationViewer/LocationViewer";

import "./index.scss";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/tour/:tourName" component={TourViewer} />
        <Route path="/location/:locationName" component={LocationViewer} />
        <Route path="/" exact component={Tours} />
      </Switch>
    </Router>
  );
}

const element = document.getElementById("app");
ReactDOM.render(<App />, element);
