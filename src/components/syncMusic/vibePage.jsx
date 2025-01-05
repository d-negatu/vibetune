import React, { useEffect } from "react";
import "./vibePage.css";
import { Icon } from '@iconify/react';
import SpotifyTrack from '../syncMusic/spotifyTrack';
import { getSpotifyToken } from "./spotfiyToken";
import { getPlaylists } from "./getUsersPlaylist";
import { getUserId } from "./getUserId";
import MusicPlayer from "./musicPlayer";
import SpotifyPlaylists from "./usersPlaylist";
import ParentComponent from "./playbackParent";


const VibePage = () => {

  return (
    <div className="vibe-page">
      {/* Frame 1 */}
      <div className="frame-1">
    
        {/* Ellipse 45 */}
        <div className="ellipse-45">
          < span className="text-m"> M </span>  
        </div>

        <Icon
          icon="mdi:cosine-wave"
          style = {{
            position: 'absolute',
            top: '21px',      // Use pixel value for vertical position
            left: '25px',     // Use pixel value for horizontal position
            fontSize: '40px',
            color: 'F7F1F1', // Set the desired color
            transform: 'translate(-50%, -50%)',  // Adjusts for centering
          }}
        />



        {/* ibetune */}
      <span className="ibetune">ibetune</span>

      </div>

      {/* Ellipse 46 */}
      <div className="ellipse-46">  
      </div>

      <span className="vibedrops">vibes</span>

      {/* Ellipse 45 */}
      <div className="line1">

      <Icon
          icon="fluent:library-20-filled"
          style={{
            position: 'absolute',
            top: '21px',      // Use pixel value for vertical position
            right: '25px',     // Use pixel value for horizontal position
            fontSize: '30px',
            color: 'F7F1F1', // Set the desired color
            transform: 'translate(-50%, -50%)',  // Adjusts for centering
          }}
        />


        <Icon
          icon="material-symbols:home-rounded"
          style={{
            position: 'absolute',
            top: '21px',      // Use pixel value for vertical position
            left: '25px',     // Use pixel value for horizontal position
            fontSize: '30px',
            color: 'F7F1F1', // Set the desired color
            transform: 'translate(-50%, -50%)',  // Adjusts for centering
          }}
        />


        <Icon
          icon="foundation:social-treehouse"
          style={{
            position: 'absolute',
            top: '21px',      // Use pixel value for vertical position
            left: '800px',     // Use pixel value for horizontal position
            fontSize: '30px',
            color: 'F7F1F1', // Set the desired color
            transform: 'translate(-50%, -50%)',  // Adjusts for centering
          }}
        />

        <Icon
          icon="material-symbols:search-rounded"
          style={{
            position: 'absolute',
            top: '21px',      // Use pixel value for vertical position
            left: '400px',     // Use pixel value for horizontal position
            fontSize: '30px',
            color: 'F7F1F1', // Set the desired color
            transform: 'translate(-50%, -50%)',  // Adjusts for centering
          }}
        />
        
      </div>


      <div className="VibePage">
        <ParentComponent/>
      </div>

      

    </div>
  );
};

export default VibePage;
