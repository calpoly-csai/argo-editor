import React from "react";
import "./Tours.scss";

import { Link } from "react-router-dom";

// We would fetch this list from the server
const tours = ["Cal Poly Main Tour", "Some department specific tour"];

export default function Tours() {
  return (
    <article className="page Tours">
      <div className="content">
        <h1>Tours</h1>
        <ul>
          {tours.map((tour) => (
            <li key={tour}>
              <Link to={`/tour/${tour}`}>{tour}</Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
