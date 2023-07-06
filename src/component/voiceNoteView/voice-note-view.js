import React, { Fragment, useState } from 'react'
import PlayIcon from '../../assets/images/filed-play-icon-purple.svg';
import DeleteButton from '../../assets/images/delete.png'
import { CSSTransition } from 'react-transition-group'
import PlayerView from '../playerControl/player-control';
import { voiceNoteDelete } from '../../actions/voice-note-action';
import { playerToggle } from '../../actions/player-action'
import ClipLoader from "react-spinners/ClipLoader";
import './voice-note-view.scss'
import { useDispatch, useSelector } from 'react-redux';
const VoiceNoteView = (props) => {
    const dispatch = useDispatch()    
    const isPlaying = useSelector((state) => state.player.isPlaying);
    const isDeleteLoading = useSelector((state) => state.voiceNotes.isLoading && 
    state.voiceNotes.from == 'delete' && state.voiceNotes.isLoading?.id == props.notes.id)

    const togglePlayerHandler = () => {
        if (isPlaying && isPlaying?.id && isPlaying?.id == props.notes.id) {
            playerToggle(null,dispatch)
        } else {
            playerToggle(props.notes,dispatch)
        }
    }

    const deleteVoiceNotes = (event) => {
        event.stopPropagation()
        voiceNoteDelete(props.notes, dispatch)        
    }

    return (
        <Fragment>
            <div className="userlist__main__row" onClick={togglePlayerHandler}>
                <div className="row row__userlist">
                    <div className="userdetail__col__left">
                        <div className="userprofile__col">
                            <div className="pic">VN</div>
                        </div>
                    </div>
                    <div className="userdetail__col__right">
                        <div className="user__info__col">
                            <div className="username">{props.notes.note}</div>
                        </div>
                        <div className="play__btn__col__right">
                            <img className="play_icon"
                                src={PlayIcon}
                                alt="menubarPlayPurpleIcon"
                            />
                            {isDeleteLoading ?
                                (
                                    <ClipLoader color={'#ffc107'} loading={isDeleteLoading} size={15} />
                                )
                                : (
                                    <img className="delete_icon"
                                        src={DeleteButton}
                                        onClick={deleteVoiceNotes}
                                        alt="menubarPlayPurpleIcon"
                                    />
                                )
                            }

                        </div>

                    </div>
                </div>
                <div className="row row--lg separator-menuhome"></div>
                <div className="player-container">
                    <CSSTransition
                        in={isPlaying && isPlaying?.id == props.notes.id}
                        timeout={450}
                        classNames="player-transition"
                        unmountOnExit
                    >
                        <div className="player-control-view">
                            <PlayerView
                                notes={props.notes}
                            />
                        </div>
                    </CSSTransition>
                </div>
            </div>
        </Fragment>
    )
}

export default VoiceNoteView