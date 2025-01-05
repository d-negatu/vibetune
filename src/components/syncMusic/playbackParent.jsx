import React, { useState } from 'react';
import SpotifyTrack from './spotifyTrack';
import MusicPlayer from './musicPlayer';

const ParentComponent = () => {
  const [trackData, setTrackData] = useState(null);

  return (
    <div>
      <SpotifyTrack setTrackData={setTrackData} />
      <MusicPlayer trackData={trackData} />
    </div>
  );
};

export default ParentComponent;