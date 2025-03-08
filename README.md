## Getting Started
This is a Next.js application built using the App Router, with an integrated API endpoint serving data from root/data/graph.json. The app visualizes a Directed Acyclic Graph (DAG) of forms and allows users to manage prefill mappings for form fields.

Start the development server with one of these commands. This launches the app on http://localhost:3000 by default:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Prerequisites
Node.js (v16 or later recommended)
npm, yarn, pnpm, or bun (choose your package manager)
Running the Development Server


## Project Structure
* API Endpoint: The "FrontEndChallengeServer" is a Route Handler at /frontendchallengeserver.
    * Location: src/app/frontendchallengeserver/route.ts (TypeScript)
    * Access: Visit http://localhost:3000/frontendchallengeserver to see the raw JSON response.
    * Data Source: The API reads from data/graph.json in the project root.

* Frontend: The main page (e.g., src/app/page.tsx) fetches this data and renders it.