import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { MarkdownService, Entry } from './markdown.service';

export interface Topic {
  id: string;
  name: string;
  file: string;
}

// Maps topic ID to the markdown file(s) that supply its data.
// Each topic node in the DSA tree maps to one or more .md files.
const TOPIC_FILE_MAP: Record<string, { name: string; files: string[] }> = {
  'arrays-hashing': {
    name: 'Arrays & Hashing',
    files: ['hashmap.md', 'arrays.md', 'arraylist.md', 'string.md'],
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

@Injectable()
export class TopicsService {
  private readonly cheatsheetDir = path.resolve(
    process.cwd(),
    '../docs/cheatsheet',
  );

  constructor(private readonly markdownService: MarkdownService) {}

  getAllTopics(): Topic[] {
    return Object.entries(TOPIC_FILE_MAP).map(([id, { name, files }]) => ({
      id,
      name,
      file: files[0],
    }));
  }

  getTopicEntries(topicId: string): { topic: Topic; entries: Entry[] } {
    const topicDef = TOPIC_FILE_MAP[topicId];
    if (!topicDef) throw new NotFoundException(`Topic '${topicId}' not found`);

    const allEntries: Entry[] = [];
    for (const file of topicDef.files) {
      const filePath = path.join(this.cheatsheetDir, file);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, 'utf-8');
      allEntries.push(...this.markdownService.parseTable(content));
    }

    return {
      topic: { id: topicId, name: topicDef.name, file: topicDef.files[0] },
      entries: allEntries,
    };
  }

  searchAll(query: string): { topicId: string; topicName: string; entries: Entry[] }[] {
    const q = query.toLowerCase();
    const results: { topicId: string; topicName: string; entries: Entry[] }[] = [];

    for (const [topicId, { name, files }] of Object.entries(TOPIC_FILE_MAP)) {
      const allEntries: Entry[] = [];
      for (const file of files) {
        const filePath = path.join(this.cheatsheetDir, file);
        if (!fs.existsSync(filePath)) continue;
        const content = fs.readFileSync(filePath, 'utf-8');
        allEntries.push(...this.markdownService.parseTable(content));
      }
      const matched = allEntries.filter(
        (e) =>
          e.method.toLowerCase().includes(q) ||
          e.syntax.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q),
      );
      if (matched.length > 0) {
        results.push({ topicId, topicName: name, entries: matched });
      }
    }
    return results;
  }

  searchInTopic(topicId: string, query: string): Entry[] {
    const { entries } = this.getTopicEntries(topicId);
    const q = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.method.toLowerCase().includes(q) ||
        e.syntax.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q),
    );
  }

  addEntry(topicId: string, entry: Partial<Entry>): Entry[] {
    const topicDef = TOPIC_FILE_MAP[topicId];
    if (!topicDef) throw new NotFoundException(`Topic '${topicId}' not found`);

    const primaryFile = path.join(this.cheatsheetDir, topicDef.files[0]);
    let content = fs.existsSync(primaryFile)
      ? fs.readFileSync(primaryFile, 'utf-8')
      : `# ${topicDef.name} Cheatsheet\n\n| Phương thức | Cú pháp | Mô tả |\n| :--- | :--- | :--- |\n`;

    const entries = this.markdownService.parseTable(content);
    entries.push({
      method: entry.method ?? '',
      syntax: entry.syntax ?? '',
      description: entry.description ?? '',
    });

    const newContent = this.markdownService.serializeTable(entries, content);
    fs.writeFileSync(primaryFile, newContent, 'utf-8');
    return entries;
  }

  updateEntry(topicId: string, rowIndex: number, entry: Partial<Entry>): Entry[] {
    const topicDef = TOPIC_FILE_MAP[topicId];
    if (!topicDef) throw new NotFoundException(`Topic '${topicId}' not found`);

    const primaryFile = path.join(this.cheatsheetDir, topicDef.files[0]);
    if (!fs.existsSync(primaryFile))
      throw new NotFoundException(`File not found for topic '${topicId}'`);

    const content = fs.readFileSync(primaryFile, 'utf-8');
    const entries = this.markdownService.parseTable(content);
    if (rowIndex < 0 || rowIndex >= entries.length)
      throw new NotFoundException(`Row index ${rowIndex} out of bounds`);

    entries[rowIndex] = {
      method: entry.method ?? entries[rowIndex].method,
      syntax: entry.syntax ?? entries[rowIndex].syntax,
      description: entry.description ?? entries[rowIndex].description,
    };

    const newContent = this.markdownService.serializeTable(entries, content);
    fs.writeFileSync(primaryFile, newContent, 'utf-8');
    return entries;
  }

  deleteEntry(topicId: string, rowIndex: number): Entry[] {
    const topicDef = TOPIC_FILE_MAP[topicId];
    if (!topicDef) throw new NotFoundException(`Topic '${topicId}' not found`);

    const primaryFile = path.join(this.cheatsheetDir, topicDef.files[0]);
    if (!fs.existsSync(primaryFile))
      throw new NotFoundException(`File not found for topic '${topicId}'`);

    const content = fs.readFileSync(primaryFile, 'utf-8');
    const entries = this.markdownService.parseTable(content);
    if (rowIndex < 0 || rowIndex >= entries.length)
      throw new NotFoundException(`Row index ${rowIndex} out of bounds`);

    entries.splice(rowIndex, 1);
    const newContent = this.markdownService.serializeTable(entries, content);
    fs.writeFileSync(primaryFile, newContent, 'utf-8');
    return entries;
  }
}
