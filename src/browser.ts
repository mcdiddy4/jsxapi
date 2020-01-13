import WSBackend from './backend/ws';
import connectOverload from './connect';
import websocketConnect from './transport/ws';
import { Options } from './types';
import XAPI from './xapi';
import { Backend } from './backend';

export { default as XAPI } from './xapi';

function initBackend(opts: Options) {
  const { protocol } = opts;
  switch (protocol) {
    case '':
    case 'ws:':
    case 'wss:': {
      const createWebSocket = (url: string, auth: string) => {
        return new WebSocket(url, auth);
      };
      const transport = websocketConnect(createWebSocket, opts);
      return new WSBackend(transport);
    }
    default:
      throw new Error(`Invalid protocol: ${protocol}`);
  }
}

export function connectGen<T extends XAPI>(XAPI: new (backend: Backend) => T) {
  return connectOverload<T>(initBackend, { protocol: 'wss:' })(XAPI);
}

/**
 * Function for connecting to the XAPI.
 */
export const connect = connectGen(XAPI);
