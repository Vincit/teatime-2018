import ReconnectingWebSocket from './reconnecting-websocket';

export const connect = () => {
  const host = location.origin.replace(/^http/, 'ws')
  const ws = new ReconnectingWebSocket(host+"/ws");
  return ws;
} 