import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'graph.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to load graph.json' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}