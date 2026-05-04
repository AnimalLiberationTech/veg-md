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
  "*": ["class", "id"],
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

const allowedStyles: sanitizeHtml.IOptions["allowedStyles"] = {
  "*": {
    "text-align": [/^(?:left|right|center|justify)$/],
    "color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/],
    "background-color": [/^#[0-9a-fA-F]{3,8}$/, /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/],
    "font-weight": [/^(?:normal|bold|bolder|lighter|\d{3})$/],
    "font-style": [/^(?:normal|italic|oblique)$/],
    "text-decoration": [/^(?:none|underline|overline|line-through)$/],
    "width": [/^\d+(?:px|%|em|rem)$/],
    "height": [/^\d+(?:px|%|em|rem)$/],
    "max-width": [/^\d+(?:px|%|em|rem)$/],
    "float": [/^(?:left|right|none)$/],
  },
};

const wpArticleSanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags,
  allowedAttributes,
  allowedStyles,
  allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        const relParts = (attribs.rel || "").split(/\s+/).filter(Boolean);
        if (!relParts.includes("noopener")) relParts.push("noopener");
        if (!relParts.includes("noreferrer")) relParts.push("noreferrer");
        return { tagName, attribs: { ...attribs, rel: relParts.join(" ") } };
      }
      return { tagName, attribs };
    },
  },
};

export function sanitizeWpArticleHtml(html: string): string {
  return sanitizeHtml(html, wpArticleSanitizeOptions);
}

