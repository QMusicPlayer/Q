import React from 'react';
import { PlayButton, Progress, Icons } from 'react-soundplayer/components';

export class Player extends React.Component {
    play(stream) {
        let { soundCloudAudio, playing } = this.props;
        if (playing) {
            soundCloudAudio.pause();
        } else {
            soundCloudAudio.play({streamUrl: stream});
        }
    }

    render() {
        let { track, playing } = this.props;

        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h2>{track.title}</h2>
                <h3>{track.user.username}</h3>
                <button onClick={this.play.bind(this, track.stream_url)}>
                    {playing ? 'Pause' : 'Play'}
                </button>
            </div>
        );
    }
}
