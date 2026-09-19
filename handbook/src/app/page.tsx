'use client';

import TreeGraph from '@/components/TreeGraph';

export default function HomePage() {
  return (
    <main className="page-container">
      <div className="tree-page-intro">
        <h1>DSA Roadmap</h1>
        <p>Click a topic node to browse and search Java syntax for that topic.</p>
      </div>
      <TreeGraph />
    </main>
  );
}
