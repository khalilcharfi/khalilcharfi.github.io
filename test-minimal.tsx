import React from 'react';
import { createRoot } from 'react-dom/client';

console.log('Minimal test starting...');

const MinimalApp: React.FC = () => {
    console.log('MinimalApp rendering...');
    return (
        <div style={{ padding: '20px', background: 'lightgreen', color: 'black' }}>
            <h1>Minimal React App Working!</h1>
            <p>This is a minimal test to see if React is working at all.</p>
        </div>
    );
};

console.log('Creating root element...');
const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
    console.log('Creating React root...');
    const root = createRoot(rootElement);
    console.log('Rendering minimal app...');
    root.render(<MinimalApp />);
    console.log('Minimal app rendered!');
} else {
    console.error('Root element not found!');
}
