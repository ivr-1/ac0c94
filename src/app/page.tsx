import axios from 'axios';
import Graph from './graph';
import { GraphData } from './types';

async function fetchData(): Promise<GraphData | string> {
  try {
    const response = await axios.get<GraphData>(
      'http://localhost:3000/frontendchallengeserver',
      {
        headers: { Accept: 'application/json, application/problem+json' },
      }
    );
    return response.data; 
  } catch (error) {
    return `Error: ${(error as Error).message}`;
  }
}

export default async function Home() {
  const data = await fetchData();

  if (typeof data === 'string') {
    return <div>Error: {data}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Graph data={data} />
    </div>
  );
}