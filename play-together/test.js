const peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: [
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302'
      ]
    }
  ],
  iceCandidatePoolSize: 10
});

const sendChannel = peerConnection.createDataChannel('data-channel');
sendChannel.binaryType = "arraybuffer";

const offer = await peerConnection.createOffer();
await peerConnection.setLocalDescription(offer);
await new Promise((resolve) => {
  peerConnection.onicegatheringstatechange  = () => {
    const state = peerConnection.iceGatheringState;
    console.log('ice-gathering-state:', state);
    if (state === "complete") {
      resolve();    
    };
  };
  peerConnection.oniceconnectionstatechange = () => {
    console.log('ice-connection-state:', this.peerConnection.iceConnectionState);
  };
});

console.log(JSON.stringify(peerConnection.localDescription));
