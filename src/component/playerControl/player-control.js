import './player-control.scss'

import React, { useRef } from 'react'
import ReactAudioPlayer from 'react-audio-player'

const PlayerView = props => {
  const audioPlayer = useRef(null)  
  const {notes} = props
  console.log("notes",notes)
  const errorPlayer = () => {
      alert("Playback error!!")
  }
  return (
    <div className="row row__audiovideo__view">
        <ReactAudioPlayer                 
          listenInterval={100}
          onError={errorPlayer}
          ref={audioPlayer}
          id="audioplayer"          
          src={notes.file?.blobURL}
          autoPlay
          controls
          controlsList="nodownload"
        />      
    </div>
  )
}

export default PlayerView
