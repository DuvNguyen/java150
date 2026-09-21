import * as fs from 'fs';
import * as path from 'path';

export interface Entry {
  topic?: string;
  method: string;
  syntax: string;
  returns?: string;
  description: string;
}

export interface Topic {
  id: string;
  name: string;
  file: string;
}

export const TOPIC_FILE_MAP: Record<string, { name: string; files: string[] }> = {
  prerequisites: {
    name: 'Prerequisites (Core Foundations)',
    files: ['prerequisites.md'],
  },
  'arrays-hashing': {
    name: 'Arrays & Hashing',
    files: ['hashmap.md', 'arrays.md', 'arraylist.md', 'string.md', 'algorithms-patterns.md'],
  },
  'two-pointers': { name: 'Two Pointers', files: ['two-pointers.md'] },
  stack: { name: 'Stack', files: ['stack.md'] },
  'binary-search': { name: 'Binary Search', files: ['binary-search.md'] },
  'sliding-window': { name: 'Sliding Window', files: ['sliding-window.md'] },
  'linked-list': { name: 'Linked List', files: ['linked-list.md'] },
  trees: { name: 'Trees', files: ['trees.md'] },
  tries: { name: 'Tries', files: ['tries.md'] },
  backtracking: { name: 'Backtracking', files: ['backtracking.md'] },
  'heap-priority-queue': {
    name: 'Heap / Priority Queue',
    files: ['heap.md'],
  },
  graphs: { name: 'Graphs', files: ['graphs.md'] },
  'advanced-graphs': { name: 'Advanced Graphs', files: ['advanced-graphs.md'] },
  'dynamic-programming-1d': {
    name: '1-D Dynamic Programming',
    files: ['dp-1d.md'],
  },
  'dynamic-programming-2d': {
    name: '2-D Dynamic Programming',
    files: ['dp-2d.md'],
  },
  greedy: { name: 'Greedy', files: ['greedy.md'] },
  intervals: { name: 'Intervals', files: ['intervals.md'] },
  'bit-manipulation': {
    name: 'Bit Manipulation',
    files: ['bit-manipulation.md'],
  },
  'math-geometry': { name: 'Math & Geometry', files: ['math-geometry.md'] },
};

function getCheatsheetDir(): string {
  const candidates = [
    path.resolve(process.cwd(), '../docs/cheatsheet'),
    path.resolve(process.cwd(), 'docs/cheatsheet'),
    path.resolve('/projects/java150/docs/cheatsheet'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

export function getSubtopicName(file: string, content: string): string {
  const titleMatch = content.match(/^#\s+(.+?)(?:\s+Cheatsheet)?\s*$/m);
  if (titleMatch) {
    let name = titleMatch[1].replace(/Cheatsheet/i, '').replace(/`/g, '').trim();
    name = name.replace(/\s*\([^)]*\)$/, '').trim();
    if (name) return name;
  }
  const base = file.replace(/\.md$/, '').toLowerCase();
  const map: Record<string, string> = {
    hashmap: 'HashMap',
    arraylist: 'ArrayList',
    arrays: 'Arrays',
    string: 'String',
    'algorithms-patterns': 'Algorithm & Pattern',
    prerequisites: 'Prerequisites',
    'two-pointers': 'Two Pointers',
    stack: 'Stack',
    'binary-search': 'Binary Search',
    'sliding-window': 'Sliding Window',
    'linked-list': 'Linked List',
    trees: 'Trees',
    tries: 'Tries',
    backtracking: 'Backtracking',
    heap: 'Heap / Priority Queue',
    graphs: 'Graphs',
    'advanced-graphs': 'Advanced Graphs',
    'dp-1d': '1-D DP',
    'dp-2d': '2-D DP',
    greedy: 'Greedy',
    intervals: 'Intervals',
    'bit-manipulation': 'Bit Manipulation',
    'math-geometry': 'Math & Geometry',
  };
  return map[base] || base;
}

export function parseTable(content: string, subtopic?: string): Entry[] {
  const lines = content.split('\n');
  const tableLines = lines.filter((l) => l.trim().startsWith('|'));

  if (tableLines.length < 3) return [];

  const dataLines = tableLines.slice(2);

  return dataLines
    .filter((line) => line.trim().length > 1)
    .map((line) => {
      const cells = line
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim().replace(/`/g, ''));

      if (cells.length >= 4) {
        return {
          topic: subtopic || '',
          method: cells[0] ?? '',
          syntax: cells[1] ?? '',
          returns: cells[2] ?? '',
          description: cells[3] ?? '',
        };
      }

      return {
        topic: subtopic || '',
        method: cells[0] ?? '',
        syntax: cells[1] ?? '',
        returns: '',
        description: cells[2] ?? '',
      };
    });
}

export function serializeTable(entries: Entry[], existingContent: string): string {
  const tableHeader =
    '| Phương thức | Cú pháp | Giá trị trả về | Mô tả |\n| :--- | :--- | :--- | :--- |';
  const tableRows = entries
    .map(
      (e) =>
        `| \`${e.method}\` | \`${e.syntax}\` | ${e.returns && e.returns !== '—' ? `\`${e.returns}\`` : '—'} | ${e.description} |`,
    )
    .join('\n');
  const newTable = `${tableHeader}\n${tableRows}`;

  const tableRegex = /\|.*\|\n\|[-: |]+\|\n((?:\|.*\|\n?)*)/;
  if (tableRegex.test(existingContent)) {
    return existingContent.replace(tableRegex, newTable + '\n');
  }

  return existingContent + '\n\n' + newTable + '\n';
}

export function getAllTopics(): Topic[] {
  return Object.entries(TOPIC_FILE_MAP).map(([id, { name, files }]) => ({
    id,
    name,
    file: files[0],
  }));
}

export function getTopicEntries(topicId: string): { topic: Topic; entries: Entry[] } | null {
  const topicDef = TOPIC_FILE_MAP[topicId];
  if (!topicDef) return null;

  const dir = getCheatsheetDir();
  const allEntries: Entry[] = [];

  for (const file of topicDef.files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const subtopic = getSubtopicName(file, content);
    allEntries.push(...parseTable(content, subtopic));
  }

  return {
    topic: { id: topicId, name: topicDef.name, file: topicDef.files[0] },
    entries: allEntries,
  };
}

export function searchAll(
  query: string,
  topicFilter?: string,
): { topicId: string; topicName: string; entries: Entry[] }[] {
  const q = query.toLowerCase().trim();
  const tf = topicFilter?.toLowerCase().trim();
  const results: { topicId: string; topicName: string; entries: Entry[] }[] = [];
  const dir = getCheatsheetDir();

  for (const [topicId, { name, files }] of Object.entries(TOPIC_FILE_MAP)) {
    const isMainTopicMatch = !tf || tf === 'all' || topicId.toLowerCase() === tf || name.toLowerCase().includes(tf);

    const allEntries: Entry[] = [];
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf-8');
      const subtopic = getSubtopicName(file, content);
      allEntries.push(...parseTable(content, subtopic));
    }

    const matched = allEntries.filter((e) => {
      const matchesTopic =
        isMainTopicMatch ||
        (e.topic && (e.topic.toLowerCase() === tf || e.topic.toLowerCase().includes(tf)));
      if (!matchesTopic) return false;

      if (!q) return true;
      return (
        (e.topic && e.topic.toLowerCase().includes(q)) ||
        e.method.toLowerCase().includes(q) ||
        e.syntax.toLowerCase().includes(q) ||
        (e.returns && e.returns.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q)
      );
    });

    if (matched.length > 0) {
      results.push({ topicId, topicName: name, entries: matched });
    }
  }
  return results;
}

export function searchInTopic(topicId: string, query: string, topicFilter?: string): Entry[] | null {
  const topicData = getTopicEntries(topicId);
  if (!topicData) return null;

  const q = query.toLowerCase().trim();
  const tf = topicFilter?.toLowerCase().trim();

  return topicData.entries.filter((e) => {
    const matchesTopic =
      !tf || tf === 'all' || (e.topic && (e.topic.toLowerCase() === tf || e.topic.toLowerCase().includes(tf)));
    if (!matchesTopic) return false;

    if (!q) return true;
    return (
      (e.topic && e.topic.toLowerCase().includes(q)) ||
      e.method.toLowerCase().includes(q) ||
      e.syntax.toLowerCase().includes(q) ||
      (e.returns && e.returns.toLowerCase().includes(q)) ||
      e.description.toLowerCase().includes(q)
    );
  });
}

export function addEntry(topicId: string, entry: Partial<Entry>): Entry[] | null {
  const topicDef = TOPIC_FILE_MAP[topicId];
  if (!topicDef) return null;

  const dir = getCheatsheetDir();
  const primaryFile = path.join(dir, topicDef.files[0]);
  let content = fs.existsSync(primaryFile)
    ? fs.readFileSync(primaryFile, 'utf-8')
    : `# ${topicDef.name} Cheatsheet\n\n| Phương thức | Cú pháp | Giá trị trả về | Mô tả |\n| :--- | :--- | :--- | :--- |\n`;

  const subtopic = getSubtopicName(topicDef.files[0], content);
  const entries = parseTable(content, subtopic);
  entries.push({
    topic: entry.topic || subtopic,
    method: entry.method ?? '',
    syntax: entry.syntax ?? '',
    returns: entry.returns ?? '',
    description: entry.description ?? '',
  });

  const newContent = serializeTable(entries, content);
  fs.writeFileSync(primaryFile, newContent, 'utf-8');
  return entries;
}

export function updateEntry(topicId: string, rowIndex: number, entry: Partial<Entry>): Entry[] | null {
  const topicDef = TOPIC_FILE_MAP[topicId];
  if (!topicDef) return null;

  const dir = getCheatsheetDir();
  const primaryFile = path.join(dir, topicDef.files[0]);
  if (!fs.existsSync(primaryFile)) return null;

  const content = fs.readFileSync(primaryFile, 'utf-8');
  const subtopic = getSubtopicName(topicDef.files[0], content);
  const entries = parseTable(content, subtopic);
  if (rowIndex < 0 || rowIndex >= entries.length) return null;

  entries[rowIndex] = {
    topic: entry.topic ?? entries[rowIndex].topic,
    method: entry.method ?? entries[rowIndex].method,
    syntax: entry.syntax ?? entries[rowIndex].syntax,
    returns: entry.returns ?? entries[rowIndex].returns ?? '',
    description: entry.description ?? entries[rowIndex].description,
  };

  const newContent = serializeTable(entries, content);
  fs.writeFileSync(primaryFile, newContent, 'utf-8');
  return entries;
}

export function deleteEntry(topicId: string, rowIndex: number): Entry[] | null {
  const topicDef = TOPIC_FILE_MAP[topicId];
  if (!topicDef) return null;

  const dir = getCheatsheetDir();
  const primaryFile = path.join(dir, topicDef.files[0]);
  if (!fs.existsSync(primaryFile)) return null;

  const content = fs.readFileSync(primaryFile, 'utf-8');
  const subtopic = getSubtopicName(topicDef.files[0], content);
  const entries = parseTable(content, subtopic);
  if (rowIndex < 0 || rowIndex >= entries.length) return null;

  entries.splice(rowIndex, 1);
  const newContent = serializeTable(entries, content);
  fs.writeFileSync(primaryFile, newContent, 'utf-8');
  return entries;
}
