/** Light cleanup for rich HTML before render */
export function cleanEditorHtml(html: string): string {
  let out = html
    .replace(/^(?:\s|&nbsp;)+|(?:\s|&nbsp;)+$/gi, "")
    .replace(/(<br\s*\/?>\s*)+$/gi, "");

  out = out.replace(/<a\b([^>]*)>/gi, (_, attrs: string) => {
    const hasTarget = /target\s*=/i.test(attrs);
    const hasRel = /rel\s*=/i.test(attrs);
    let next = attrs;
    if (!hasTarget) next += ' target="_blank"';
    if (!hasRel) next += ' rel="noopener noreferrer"';
    return `<a${next}>`;
  });

  return out;
}

export function formatTagLabel(tag: string): string {
  return tag
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
