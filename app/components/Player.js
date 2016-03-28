import React from 'react';
import { PlayButton, Progress, Icons } from 'react-soundplayer/components';
import FlatButton from 'material-ui/lib/flat-button';
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
        let { track, playing, soundCloudAudio } = this.props;

        if (!track) {
            return <div>There are currently no tracks in your playlist...</div>;
        }

        return (
            <div>
                <h2>{track.title} {track.user.username}</h2>
                <FlatButton primary={true} onClick={this.play.bind(this, track.stream_url)}>
                    {playing ? 'Pause' : 'Play'}
                </FlatButton>
            </div>
        );
    }
}
