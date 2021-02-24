import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Welcome from "./pages/Welcome/Welcome";
import MidasMVP from "./pages/MidasMVP/MidasMVP";

import "./index.scss";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={MidasMVP} />
      </Switch>
    </Router>
  );
}

const element = document.getElementById("app");
ReactDOM.render(<App />, element);
