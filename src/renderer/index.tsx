/* eslint-disable import/no-named-as-default */
import { createRoot } from 'react-dom/client';
// eslint-disable-next-line import/no-named-as-default-member
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once('ipc-example', (arg) => {
// eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
