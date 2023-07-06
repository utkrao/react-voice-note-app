import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import './voice-note-list.scss';
import VoiceNoteView from './../../component/voiceNoteView/voice-note-view';
import { voiceNoteListRequest } from '../../actions/voice-note-action'
import { useHistory } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
const VoiceNotesList = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const list = useSelector((state) => state.voiceNotes.voiceNoteList)
    const isLoading = useSelector((state) => state.voiceNotes.isLoading && state.voiceNotes.from == 'list')
    useEffect(() => {
        voiceNoteListRequest(dispatch)
    }, [])

    const backToRecorder = () => {
        history.push("/voice-recorder")
    }

    return (
        <div className="voice_list_wrapper">
            {
                isLoading ? (
                    <div className="loader">
                        <BeatLoader color={'#ffc107'} loading={isLoading} size={15} />
                    </div>
                ) : null
            }

            {list && list.length > 0 && !isLoading ? (
                list.map((notes) => {
                    return (
                        <VoiceNoteView
                            notes={notes}
                            key={notes.id}
                        />
                    )
                })
            ) : (
                <div className="no-list">
                    {
                        !isLoading ? (
                            <span>No Voice Notes here...!! <input type="button" value="Back" id="back" name="back" className="btn_back" onClick={backToRecorder} /></span>
                        ) : null
                    }
                </div>
            )
            }
        </div>
    )
}

export default VoiceNotesList