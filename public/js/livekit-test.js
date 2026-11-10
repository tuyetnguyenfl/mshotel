
import { Room, RoomEvent, Track } from 'livekit-client';

const statusElement = document.getElementById('status');

const startButton = document.getElementById('startBroadcast');
const stopButton = document.getElementById('stopBroadcast');
const joinButton = document.getElementById('joinViewer');
const leaveButton = document.getElementById('leaveViewer');

const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');

const ROOM_NAME = 'beyondme-issue1-test';

let publisherRoom = null;
let viewerRoom = null;
let localCameraTrack = null;
let localMicrophoneTrack = null;

function setStatus(message) {
  statusElement.textContent = message;
}

async function requestToken(role) {
  const response = await fetch('/api/admin/livekit/test-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({ role })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Token request failed: ${response.status}`);
  }

  if (data.roomName !== ROOM_NAME) {
    throw new Error('Unexpected LiveKit room name.');
  }

  return data;
}

// Display incoming video or audio tracks.
function displayRemoteTrack(track, participant) {
  const mediaElement = track.attach();

  const container = document.createElement('div');
  const label = document.createElement('p');

  label.className = 'video-label';

  if (track.kind === Track.Kind.Video) {
    mediaElement.autoplay = true;
    mediaElement.playsInline = true;

    label.textContent = `Video: ${participant.identity}`;
  } else if (track.kind === Track.Kind.Audio) {
    mediaElement.autoplay = true;
    mediaElement.controls = true;

    label.textContent = `Audio: ${participant.identity}`;
  } else {
    mediaElement.remove();
    return;
  }

  container.appendChild(label);
  container.appendChild(mediaElement);

  remoteVideos.appendChild(container);
}

// Remove media elements when their tracks are unsubscribed.
function removeRemoteTrack(track) {
  track.detach().forEach(element => {
    const container = element.parentElement;

    if (container) {
      container.remove();
    } else {
      element.remove();
    }
  });
}

// Start broadcasting camera and microphone.
async function startBroadcast() {
  startButton.disabled = true;

  try {
    setStatus('Requesting publisher token...');

    const credentials = await requestToken('publisher');

    publisherRoom = new Room();

    publisherRoom.on(RoomEvent.Disconnected, () => {
      setStatus('Broadcaster disconnected.');
      startButton.disabled = false;
      stopButton.disabled = true;
    });

    setStatus('Connecting to LiveKit...');

    await publisherRoom.connect(
      credentials.serverUrl,
      credentials.token
    );

    setStatus('Connected. Requesting camera and microphone...');

    await publisherRoom.localParticipant.setCameraEnabled(true);
    await publisherRoom.localParticipant.setMicrophoneEnabled(true);

    localCameraTrack = publisherRoom.localParticipant
      .getTrackPublication(Track.Source.Camera)?.track;

    localMicrophoneTrack = publisherRoom.localParticipant
      .getTrackPublication(Track.Source.Microphone)?.track;

    if (!localCameraTrack || !localMicrophoneTrack) {
      throw new Error('Camera or microphone could not be started.');
    }

    localCameraTrack.attach(localVideo);

    stopButton.disabled = false;

    setStatus('You are broadcasting! Waiting for viewers...');
  } catch (error) {
    console.error('Broadcast error:', error);

    await stopBroadcast();

    setStatus(`Broadcast failed: ${error.message}`);
  } finally {
    startButton.disabled = Boolean(
      publisherRoom?.state === 'connected'
    );
  }
}

// Stop broadcasting and release local media tracks.
async function stopBroadcast() {
  try {
    if (publisherRoom) {
      const room = publisherRoom;
      publisherRoom = null;

      await room.disconnect();
    }

    if (localCameraTrack) {
      localCameraTrack.detach();
      localCameraTrack.stop();
      localCameraTrack = null;
    }

    if (localMicrophoneTrack) {
      localMicrophoneTrack.stop();
      localMicrophoneTrack = null;
    }

    localVideo.srcObject = null;

    stopButton.disabled = true;
    startButton.disabled = false;

    setStatus('Broadcast stopped.');
  } catch (error) {
    console.error('Stop broadcast error:', error);
    setStatus(`Could not stop broadcast cleanly: ${error.message}`);
  }
}

// Join as a viewer and receive published media tracks.
async function joinViewer() {
  joinButton.disabled = true;

  try {
    setStatus('Requesting viewer token...');

    const credentials = await requestToken('viewer');

    viewerRoom = new Room();

    viewerRoom.on(
      RoomEvent.TrackSubscribed,
      (track, publication, participant) => {
        displayRemoteTrack(track, participant);

        setStatus(
          `Receiving ${track.kind} from ${participant.identity}.`
        );
      }
    );

    viewerRoom.on(
      RoomEvent.TrackUnsubscribed,
      track => {
        removeRemoteTrack(track);
      }
    );

    viewerRoom.on(RoomEvent.Disconnected, () => {
      setStatus('Viewer disconnected.');
    });

    setStatus('Connecting as viewer...');

    await viewerRoom.connect(
      credentials.serverUrl,
      credentials.token
    );

    leaveButton.disabled = false;

    setStatus('Connected as viewer. Waiting for a broadcaster...');
  } catch (error) {
    console.error('Viewer error:', error);

    if (viewerRoom) {
      const room = viewerRoom;
      viewerRoom = null;

      await room.disconnect();
    }

    joinButton.disabled = false;
    leaveButton.disabled = true;

    setStatus(`Viewer connection failed: ${error.message}`);
  }
}

// Leave the room and remove all remote media.
async function leaveViewer() {
  try {
    if (viewerRoom) {
      const room = viewerRoom;
      viewerRoom = null;

      await room.disconnect();
    }

    remoteVideos.replaceChildren();

    joinButton.disabled = false;
    leaveButton.disabled = true;

    setStatus('You left the broadcast.');
  } catch (error) {
    console.error('Leave viewer error:', error);
    setStatus(`Could not leave cleanly: ${error.message}`);
  }
}

startButton.addEventListener('click', startBroadcast);
stopButton.addEventListener('click', stopBroadcast);
joinButton.addEventListener('click', joinViewer);
leaveButton.addEventListener('click', leaveViewer);
