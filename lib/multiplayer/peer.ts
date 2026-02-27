import type { PeerJSOption } from 'peerjs';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'] },
  {
    urls: [
      'turn:openrelay.metered.ca:80',
      'turn:openrelay.metered.ca:443',
      'turn:openrelay.metered.ca:443?transport=tcp'
    ],
    username: 'openrelayproject',
    credential: 'openrelayproject'
  }
];

export const PEER_OPTIONS: PeerJSOption = {
  debug: 1,
  config: {
    iceServers: ICE_SERVERS,
    iceCandidatePoolSize: 10
  }
};

export const CONNECTION_TIMEOUT_MS = 12000;
