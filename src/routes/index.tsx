import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Homepage,
});

function Homepage() {
  return (
    <main>
      <h1>KAG Logistics</h1>
    </main>
  );
}
