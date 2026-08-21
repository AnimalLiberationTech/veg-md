export const hasHttpProtocol = (url: string) => /^https?:\/\//i.test(url);

export const getExternalUrl = (type: string, url: string): string | null => {
  const rawUrl = url.trim();
  if (!rawUrl) return null;

  if (hasHttpProtocol(rawUrl)) return rawUrl;

  const lowerType = type.toLowerCase();

  switch (lowerType) {
    case "youtube":
      if (rawUrl.startsWith("@")) return `https://www.youtube.com/${rawUrl}`;
      if (rawUrl.startsWith("watch?")) return `https://www.youtube.com/${rawUrl}`;
      if (rawUrl.includes("/")) return `https://www.youtube.com/${rawUrl}`;
      return `https://www.youtube.com/watch?v=${rawUrl.replace(/^=/, "")}`;
    case "netflix":
      return `https://www.netflix.com/title/${rawUrl}`;
    case "vk":
      return rawUrl.startsWith("video")
        ? `https://vk.com/${rawUrl}`
        : `https://vk.com/video-${rawUrl}`;
    case "vimeo":
      return `https://vimeo.com/${rawUrl}`;
    default:
      return `https://${rawUrl}`;
  }
};

export const getEmbeddedSrc = (type: string, url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const lowerType = type.toLowerCase();

  if (lowerType === "embedded") {
    if (!trimmed.includes("<iframe")) {
      return hasHttpProtocol(trimmed) ? trimmed : null;
    }
    const match = trimmed.match(/src=["']([^"']+)["']/i);
    return match?.[1] ?? null;
  }

  if (lowerType === "youtube") {
    // 1. Full URLs or embed URLs
    const videoIdMatch = trimmed.match(
      /(?:youtu\.be\/|youtube\.com\/(?:v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=))([^#&?]+)/,
    );
    if (videoIdMatch) return `https://www.youtube.com/embed/${videoIdMatch[1]}`;

    // 2. If it's a full URL but didn't match the above, it's likely a channel/playlist/etc.
    if (hasHttpProtocol(trimmed) || trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) return null;

    // 3. Handles or paths (e.g. @handle or channel/UC...)
    if (trimmed.startsWith("@") || trimmed.includes("/")) return null;

    // 4. Just the ID (possibly with extra garbage or starting with =)
    let id = trimmed.replace(/^=/, "").split(/[&?]/)[0];
    // YouTube IDs are usually 11, but can vary.
    if (id && id.length >= 8 && id.length <= 20) return `https://www.youtube.com/embed/${id}`;
    return null;
  }

  if (lowerType === "vimeo") {
    const match = trimmed.match(
      /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)?(\d+)/,
    );
    if (match) return `https://player.vimeo.com/video/${match[1]}`;
    return null;
  }

  if (lowerType === "vk") {
    const match = trimmed.match(/(?:vk\.com\/video)?(-?\d+_\d+)/);
    if (match) {
      const [oid, id] = match[1].split("_");
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}`;
    }
    return null;
  }

  return null;
};
