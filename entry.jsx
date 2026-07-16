// Bundle entry (see build.mjs). Import order matters: content.js / icons.jsx /
// covers.jsx run first for their side effects (attaching window.CONTENT /
// window.Icons / window.Covers), then app.jsx reads those globals and renders.
import "./content.js";
import "./icons.jsx";
import "./covers.jsx";
import "./app.jsx";
