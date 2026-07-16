// Bundle entry (see build.mjs). app.jsx is a proper ES module: it imports React,
// { CONTENT } from content.js, and { Icons } from icons.jsx directly (no window
// globals), and mounts the PAGES registry onto #root as a side effect.
import "./app.jsx";
