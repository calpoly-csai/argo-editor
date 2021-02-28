import React from "react";
const { useState } = React;
import "./Overlay.scss";
import {
  Link,
  ArrowRight,
  ArrowLeft,
  Aperture,
  Database,
  X as XIcon,
} from "react-feather";

import exampleTour from "../../../assets/example-tour.json";

const views = {
  base: BaseView,
  actions: ActionsView,
  createLink: CreateLinkView,
  createPortal: CreatePortalView,
  createPath: CreatePathView,
  createDataSource: CreateDataSourceView,
};

export default function Overlay({ onDelete, x, y }) {
  const [viewName, setViewName] = useState("base");
  const CurrentView = views[viewName];
  const positionStyles = { left: x + "px", top: y + "px" };
  function navBack() {
    if (viewName === "base") onDelete();
    else setViewName(viewName === "actions" ? "base" : "actions");
  }

  return (
    <section className="Overlay" style={positionStyles}>
      <nav>
        <button className="wrapper" onClick={navBack}>
          {viewName === "base" ? <XIcon /> : <ArrowLeft />}
        </button>
      </nav>
      <CurrentView changeView={setViewName} />
    </section>
  );
}

function BaseView({ changeView }) {
  return (
    <div className="BaseView">
      <input type="text" placeholder="Title" />
      <input type="text" placeholder="Description" />

      <button onClick={() => changeView("actions")}>Add Actions</button>
    </div>
  );
}

function ActionsView({ changeView }) {
  const actions = [
    {
      symbol: Link,
      to: "createLink",
      name: "Link to Resource",
    },
    {
      symbol: ArrowRight,
      to: "createPath",
      name: "Connect to Path",
    },
    {
      symbol: Aperture,
      to: "createPortal",
      name: "Teleport to Location",
    },
    {
      symbol: Database,
      to: "createDataSource",
      name: "Fetch Data",
    },
  ];

  return (
    <div className="ActionsView">
      <h1>Actions</h1>
      <ul>
        {actions.map((action) => (
          <li className="action">
            <action.symbol />
            <a onClick={() => changeView(action.to)}>{action.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreateLinkView({ changeView }) {
  return (
    <form>
      <h1> New Link </h1>
      <input type="text" placeholder="Title" />
      <input type="text" placeholder="URL" />
      <input type="submit" value="Add Link" />
    </form>
  );
}

function CreatePathView({ changeView }) {
  return (
    <form>
      <h1> New Path </h1>
      <input type="text" placeholder="Path title" />
      <label>
        Destination:
        <select placeholder="Destination">
          {Object.values(exampleTour.locations).map(({ title }) => (
            <option value={title}>{title}</option>
          ))}
        </select>
      </label>
      <input type="file" placeholder="Path Video" />
      <input type="submit" value="Add Link" />
    </form>
  );
}

function CreateDataSourceView({ changeView }) {
  return (
    <form>
      <h1> New Link </h1>
      <input type="text" placeholder="URL" />
      <input type="text" placeholder="Data format" />
      <input type="submit" value="Add Source" />
    </form>
  );
}

function CreatePortalView({ changeView }) {
  return (
    <form>
      <select>
        {Object.values(exampleTour.locations).map(({ title }) => (
          <option value={title}>{title}</option>
        ))}
      </select>
      <input type="submit" value="Add Portal" />
    </form>
  );
}
