import { Injectable } from '@nestjs/common';

export interface Entry {
  method: string;
  syntax: string;
  description: string;
}

@Injectable()
export class MarkdownService {
  /**
   * Parse a markdown table into an array of Entry objects.
   * Handles tables with optional/empty cells.
   */
  parseTable(content: string): Entry[] {
    const lines = content.split('\n');
    // Find all lines that look like table rows (start with |)
    const tableLines = lines.filter((l) => l.trim().startsWith('|'));

    if (tableLines.length < 3) return [];

    // index 0 = header, index 1 = separator (|:---|:---|), rest = data
    const dataLines = tableLines.slice(2);

    return dataLines
      .filter((line) => line.trim().length > 1) // skip empty rows
      .map((line) => {
        const cells = line
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim().replace(/`/g, ''));

        return {
          method: cells[0] ?? '',
          syntax: cells[1] ?? '',
          description: cells[2] ?? '',
        };
      });
  }


  /**
   * Serialize an array of Entry objects back into a markdown table string.
   * Replaces the first table block found in `existingContent`.
   */
  serializeTable(entries: Entry[], existingContent: string): string {
    const tableHeader =
      '| Phương thức | Cú pháp | Mô tả |\n| :--- | :--- | :--- |';
    const tableRows = entries
      .map((e) => `| \`${e.method}\` | \`${e.syntax}\` | ${e.description} |`)
      .join('\n');
    const newTable = `${tableHeader}\n${tableRows}`;

    // Find and replace the first markdown table in the existing content
    const tableRegex = /\|.*\|\n\|[-: |]+\|\n((?:\|.*\|\n?)*)/;
    if (tableRegex.test(existingContent)) {
      return existingContent.replace(tableRegex, newTable + '\n');
    }

    // If no table found, append it
    return existingContent + '\n\n' + newTable + '\n';
  }
}
