import sanitizeHtml from "sanitize-html";

const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
  "img",
  "iframe",
  "figure",
  "figcaption",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "div",
  "ul",
  "ol",
  "li",
  "br",
  "a",
  "strong",
  "em",
  "del",
  "blockquote",
  "code",
  "pre",
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "caption",
  "colgroup",
  "col",
]);

const allowedAttributes: sanitizeHtml.IOptions["allowedAttributes"] = {
  ...sanitizeHtml.defaults.allowedAttributes,
  "*": ["class", "id", "style"],
  img: ["src", "alt", "width", "height", "loading"],
  table: ["class", "id", "style"],
  thead: ["class", "id", "style"],
  tbody: ["class", "id", "style"],
  tfoot: ["class", "id", "style"],
  tr: ["class", "id", "style"],
  th: ["class", "id", "style", "colspan", "rowspan", "scope"],
  td: ["class", "id", "style", "colspan", "rowspan"],
  caption: ["class", "id", "style"],
  colgroup: ["class", "id", "style"],
  col: ["class", "id", "style", "span"],
  iframe: [
    "src",
    "width",
    "height",
    "allow",
    "allowfullscreen",
    "frameborder",
    "title",
    "aria-label",
    "aria-labelledby",
  ],
  a: ["href", "name", "target", "rel"],
};

const wpArticleSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags,
  allowedAttributes,
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
};

export function sanitizeWpArticleHtml(html: string): string {
  return sanitizeHtml(html, wpArticleSanitizeOptions);
}

