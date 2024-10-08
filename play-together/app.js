// const peerConnection = new RTCPeerConnection({
//   iceServers: [
//     {
//       urls: [
//         'stun:stun3.l.google.com:19302',
//         'stun:stun4.l.google.com:19302'
//       ]
//     }
//   ],
//   iceCandidatePoolSize: 10
// });

// peerConnection.onicecandidate = (event) => {
//   if (event.candidate) {
//       console.log('ICE Candidate:', event.candidate);
//   } else {
//       console.log('All ICE candidates have been gathered.');
//   }
// };

// peerConnection.addEventListener('connectionstatechange', () => {
//   console.log('connection-state:', peerConnection.connectionState);
// });

// peerConnection.onicegatheringstatechange = () => {
//   console.log('ICE Gathering State:', peerConnection.iceGatheringState);
// };

// peerConnection.createOffer().then((offer) => {
//   return peerConnection.setLocalDescription(offer);
// }).then(() => {
//   console.log('Local description set.');
// }).catch((error) => {
//   console.error('Error:', error);
// });

// await new Promise((resolve) => {
//   peerConnection.onicegatheringstatechange  = () => {
//     const state = peerConnection.iceGatheringState;
//     console.log('ice-gathering-state:', state);
//     if (state === "complete") {
//       resolve();    
//     };
//   };

//   peerConnection.oniceconnectionstatechange = () => {
//     console.log('ice-connection-state:', this.peerConnection.iceConnectionState);
//   };
// });

class EventEmitter {
  constructor() {
    this.events = {};
  };

  dispatchEvent = (e, data) => {
    if (!this.events[e]) return;
    this.events[e].forEach(callback => callback(data));
  };

  addEventListener = (event, callback) => {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  };

  removeEventListener = (event) => {
    if (!this.events[event]) return;
    delete this.events[event];
  };
};

class P2P extends EventEmitter {
  constructor() {
    super();
    this.peerConnection;
    this.sendChannel;
    this.receiveChannel;
    this.localStream;
    this.remoteStream;
    this.configuration = {
      iceServers: [
        {
          urls: [
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302'
          ]
        }
      ],
      iceCandidatePoolSize: 10
    };
  };

  createPeerConnection = async () => {
    this.peerConnection = new RTCPeerConnection(this.configuration);
    this.remoteStream = new MediaStream();
    this.openSendChannel();
    this.openReceiveChannel();

    this.peerConnection.addEventListener('connectionstatechange', () => {
      console.log('connection-state:', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === "connected") {
        this.dispatchEvent('peers-connected');
      };
    });

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(
        { 
          audio: true,
          video: true
        }
      );

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream);
      });
      
      this.dispatchEvent('local-stream-available');

      this.peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach((track) => {
          this.remoteStream.addTrack(track, this.remoteStream);
        });
        this.dispatchEvent('remote-stream-available');
      };
      return true;

    } catch(err) {
      console.log(err);
      return false;
    };
  };

  openSendChannel = () => {
    const options = { 
      reliable: true 
   }; 
    
    this.sendChannel = this.peerConnection.createDataChannel('data-channel', options);
    this.sendChannel.binaryType = "arraybuffer";
  };

  openReceiveChannel = () => {
    this.peerConnection.ondatachannel = (e) => {
      if (e.channel.label === "data-channel") {
        this.receiveChannel = e.channel;
        console.log('data-channel-established');

        this.receiveChannel.onmessage = (e) => {
          const { data } = e;
          const base64Payload = JSON.parse(data);
          let payload;

          // Convert base64 string back to ArrayBuffer
          if (base64Payload.file) {
            const base64String = base64Payload.file.chunk[0];
            const byteString = atob(base64String);
            const buffer = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
              buffer[i] = byteString.charCodeAt(i);
            };
            // Create a new object with the ArrayBuffer
            payload = {
              file: {
                name: base64Payload.file.name,
                size: base64Payload.file.size,
                chunk: [buffer.buffer],
                complete: base64Payload.file.complete
              },
              chat: base64Payload.chat,
              index: base64Payload.index
            };
          } else {
            payload = {...base64Payload};
          };
          
          this.dispatchEvent('received-message', {
            detail: {
              message: payload
            }
          });
        };
      };
    };
  };

  getIceCandidates = () => {
    return new Promise((resolve) => {
      this.peerConnection.onicegatheringstatechange  = () => {
        const state = this.peerConnection.iceGatheringState;
        console.log('ice-gathering-state:', state);
        if (state === "complete") {
          resolve();    
        };
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('ice-connection-state:', this.peerConnection.iceConnectionState);
      };
    });
  };

  setup = async () => {
    const success = await this.createPeerConnection();
    if (!success) {
      throw new Error("Camera/Microphone permission denied.");
    };
  };

  createOffer = async () => {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.getIceCandidates();
    return JSON.stringify(this.peerConnection.localDescription);
  };

  acceptOffer = async (offer) => {
    if (!this.peerConnection.currentRemoteDescription) {
      try {
        await this.peerConnection.setRemoteDescription(offer);
      } catch(err) {
        console.log(err);
        throw new Error(err);
      };
    };
  };

  createAnswer = async () => {
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    await this.getIceCandidates();
    return JSON.stringify(this.peerConnection.localDescription);
  };

  acceptAnswer = async (answer) => {
    if (!this.peerConnection.currentRemoteDescription) {
      try {
        await this.peerConnection.setRemoteDescription(answer);
      } catch(err) {
        console.log(err);
        throw new Error(err);
      };
    };
  };

  pauseVideo = (bool) => {
    this.localStream.getVideoTracks().forEach((track) => {
      track.enabled = bool;
    });
  };

  pauseAudio = (bool) => {
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = bool;
    });
  };

  send = async (payload, setSendProgress) => {
    return new Promise(async (resolve) => {
      const { file, chat, index } = payload;

      if (file?.name) {
        let buffer = await file.chunk.arrayBuffer();
        const chunkSize = 16 * 1024;

        const sendInChunks = (firstRun, prevPayload) => {
          if (!buffer.byteLength && !firstRun) {
            prevPayload.file.chunk = [""];
            prevPayload.file.complete = true;
            const prevPayloadAsStr = JSON.stringify(prevPayload);
            this.sendChannel.send(prevPayloadAsStr);
            resolve();
            return;
          };
            
          const chunk = buffer.slice(0, chunkSize);
          buffer = buffer.slice(chunkSize, buffer.byteLength);
          const base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(chunk)));

          // Create a new object with the base64 string
          const payloadWithBase64 = {
            file: {
              name: file.name,
              size: file.size,
              chunk: [base64String],
              complete: false
            },
            chat: chat,
            index: index
          };

          const payloadAsStr = JSON.stringify(payloadWithBase64);
          this.sendChannel.send(payloadAsStr);

          if (this.sendChannel.bufferedAmount > this.sendChannel.bufferedAmountLowThreshold) {
            this.sendChannel.onbufferedamountlow = () => {
              this.sendChannel.onbufferedamountlow = null;
              setTimeout(() => {
                sendInChunks(false, {...payloadWithBase64});
              }, 10);
            };
          };

          const percentage = Number((((file.size - buffer.byteLength)/file.size)*100).toFixed(0));
          setSendProgress((prevState) => {
            if (percentage !== prevState) return percentage;
            return prevState;
          });
        };
        sendInChunks(true);
      } else {
        const payloadAsStr = JSON.stringify(payload);
        this.sendChannel.send(payloadAsStr);
      };
    });
  };
};

console.log('what')
const PC = new P2P();
PC.setup();
console.log(await PC.createOffer());