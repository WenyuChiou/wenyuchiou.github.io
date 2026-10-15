import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { linkedInEmbedSource } from "./linkedin.js";

export function LinkedInPreview({ post, copy }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState("loading");
  const disclosure = useRef(null);
  const summary = useRef(null);
  const source = linkedInEmbedSource(post.embedUrl);

  useEffect(() => {
    if (!expanded || status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("slow"), 12000);
    return () => window.clearTimeout(timer);
  }, [expanded, status]);

  if (!source) return null;
  const close = () => {
    disclosure.current.open = false;
    setExpanded(false);
    summary.current.focus();
  };

  return <div className="linkedin-feature">
    <p className="linkedin-preview-notice">{copy.previewPrivacy}</p>
    <details className="linkedin-preview" ref={disclosure} onToggle={event => {
    const open = event.currentTarget.open;
    setExpanded(open);
    if (open) setStatus("loading");
  }} onKeyDown={event => {
    if (event.key === "Escape" && expanded) { event.preventDefault(); close(); }
  }}>
    <summary ref={summary}><ChevronDown size={18} aria-hidden="true" /><span>{copy.previewOriginal}</span></summary>
    <div className="linkedin-preview-content">
      <noscript><p>{copy.previewNoScript}</p></noscript>
      {expanded && <>
        <p className="linkedin-preview-status" role="status">{status === "loading" ? copy.previewLoading : status === "slow" ? copy.previewSlow : ""}</p>
        <div className="linkedin-preview-frame"><iframe src={source} title={copy.previewTitle} height="1300" width="504" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" onLoad={() => setStatus("loaded")} onError={() => setStatus("slow")} /></div>
        <button className="text-link linkedin-preview-close" type="button" onClick={close}><X size={16} aria-hidden="true" />{copy.previewClose}</button>
      </>}
      <a className="text-link linkedin-preview-fallback" href={post.url} target="_blank" rel="noreferrer">{copy.previewFallback}</a>
    </div>
  </details></div>;
}
