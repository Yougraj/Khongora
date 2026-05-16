import { normalizePlainText } from './plain-text';

export type NovelEpisode = {
  id: number;
  title: string;
  duration: string;
  content: string;
};

export function normalizeEpisodesList(raw: unknown): NovelEpisode[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((ep, index) => {
    const row =
      ep && typeof ep === 'object' ? (ep as Record<string, unknown>) : {};
    return {
      id: typeof row.id === 'number' ? row.id : index + 1,
      title: String(row.title ?? `Episode ${index + 1}`),
      duration: String(row.duration ?? '25 min'),
      content:
        typeof row.content === 'string'
          ? normalizePlainText(row.content)
          : '',
    };
  });
}

export function updateEpisode(
  doc: Record<string, unknown>,
  episodeId: number,
  input: { title: string; duration?: string; content: string }
): { episodesList: NovelEpisode[]; episodes: number; chapters: number } | null {
  const list = normalizeEpisodesList(doc.episodesList);
  const index = list.findIndex((e) => e.id === episodeId);
  if (index === -1) return null;

  list[index] = {
    id: episodeId,
    title: input.title.trim() || `Episode ${episodeId}`,
    duration: input.duration?.trim() || '25 min',
    content: normalizePlainText(input.content),
  };

  return {
    episodesList: list,
    episodes: list.length,
    chapters: list.length,
  };
}

export function deleteEpisode(
  doc: Record<string, unknown>,
  episodeId: number
): { episodesList: NovelEpisode[]; episodes: number; chapters: number } | null {
  const list = normalizeEpisodesList(doc.episodesList);
  const next = list.filter((e) => e.id !== episodeId);
  if (next.length === list.length) return null;

  return {
    episodesList: next,
    episodes: next.length,
    chapters: next.length,
  };
}

export function appendEpisode(
  doc: Record<string, unknown>,
  input: { title: string; duration?: string; content: string }
): { episodesList: NovelEpisode[]; episodes: number; chapters: number } {
  const list = normalizeEpisodesList(doc.episodesList);
  const nextId = list.length ? Math.max(...list.map((e) => e.id)) + 1 : 1;
  const episode: NovelEpisode = {
    id: nextId,
    title: input.title.trim() || `Episode ${nextId}`,
    duration: input.duration?.trim() || '25 min',
    content: normalizePlainText(input.content),
  };
  const episodesList = [...list, episode];
  return {
    episodesList,
    episodes: episodesList.length,
    chapters: episodesList.length,
  };
}

/** First episode + metadata for creating a new novel. */
export function prepareNewNovelDoc(
  doc: Record<string, unknown>
): Record<string, unknown> {
  const content = normalizePlainText(String(doc.content ?? ''));
  const episodeTitle =
    String(doc.episodeTitle ?? 'Episode 1').trim() || 'Episode 1';
  const duration =
    String(doc.episodeDuration ?? '25 min').trim() || '25 min';
  const episodesList = [{ id: 1, title: episodeTitle, duration, content }];
  const rest = { ...doc };
  delete rest.content;
  delete rest.episodeTitle;
  delete rest.episodeDuration;
  return {
    ...rest,
    episodesList,
    episodes: 1,
    chapters: 1,
  };
}

export function prepareNovelUpdate(
  doc: Record<string, unknown>
): Record<string, unknown> {
  if (Array.isArray(doc.episodesList)) {
    const episodesList = normalizeEpisodesList(doc.episodesList);
    return {
      ...doc,
      episodesList,
      episodes: episodesList.length,
      chapters: episodesList.length,
    };
  }

  const rest = { ...doc };
  delete rest.content;
  delete rest.episodeTitle;
  delete rest.episodeDuration;
  return rest;
}
