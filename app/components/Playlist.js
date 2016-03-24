import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import React from 'react';
import {Player} from './Player.js';
const { SoundCloudLogoSVG } = Icons;
const clientId = 'f270bdc572dc8380259d38d8015bdbe7';

//Test track
const resolveUrl = 'https://soundcloud.com/harp00n/like-ooooh-w-alicia';

export class Playlist extends React.Component{
  render() {
    return (

      <div>
	     <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
	   		<Player/>
	     </SoundPlayerContainer>
      </div>
    )
  }
}


