import { bootstrapApp } from './app/bootstrap';
import '@/styles/globals.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing application root');
}

void bootstrapApp(root);
