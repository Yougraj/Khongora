/** Strip HTML tags and decode common entities — store and show plain text only. */
export function stripHtml(value: string): string {
  if (!value) return '';
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizePlainText(value: string): string {
  return stripHtml(value).replace(/\r\n/g, '\n');
}

const PLAIN_TEXT_KEYS = [
  'content',
  'body',
  'description',
  'summary',
  'excerpt',
  'analysis',
  'synopsis',
] as const;

/** Sanitize string fields on create/update — no HTML or markdown stored. */
export function sanitizePlainTextDoc(doc: Record<string, unknown>): Record<string, unknown> {
  const out = { ...doc };

  for (const key of PLAIN_TEXT_KEYS) {
    if (typeof out[key] === 'string') {
      out[key] = normalizePlainText(out[key]);
    }
  }

  if (Array.isArray(out.episodesList)) {
    out.episodesList = out.episodesList.map((ep, index) => {
      if (!ep || typeof ep !== 'object') return ep;
      const row = ep as Record<string, unknown>;
      return {
        ...row,
        id: row.id ?? index + 1,
        content:
          typeof row.content === 'string'
            ? normalizePlainText(row.content)
            : row.content,
      };
    });
  }

  return out;
}

/** Map a novel document to a single plain-text field for the admin editor. */
export function novelPlainContent(doc: Record<string, unknown>): string {
  if (typeof doc.content === 'string' && doc.content.trim()) {
    return normalizePlainText(doc.content);
  }
  const episodes = doc.episodesList;
  if (Array.isArray(episodes) && episodes[0] && typeof episodes[0] === 'object') {
    const first = episodes[0] as Record<string, unknown>;
    if (typeof first.content === 'string') {
      return normalizePlainText(first.content);
    }
  }
  if (typeof doc.description === 'string') {
    return normalizePlainText(doc.description);
  }
  return '';
}

/** Apply admin novel plain `content` to the first episode. */
export function applyNovelPlainContent(
  doc: Record<string, unknown>
): Record<string, unknown> {
  if (typeof doc.content !== 'string') return doc;

  const text = normalizePlainText(doc.content);
  const existing = Array.isArray(doc.episodesList) ? doc.episodesList : [];
  const first =
    existing[0] && typeof existing[0] === 'object'
      ? (existing[0] as Record<string, unknown>)
      : { id: 1, title: 'Episode 1', duration: '25 min' };

  return {
    ...doc,
    content: text,
    episodesList: [{ ...first, content: text }, ...existing.slice(1)],
  };
}
