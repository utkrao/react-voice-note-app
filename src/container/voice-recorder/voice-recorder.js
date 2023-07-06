import './voice-recorder.scss';
import microphoneIcon from '../../assets/images/ico_voice_record_active.svg';
import audioService from '../../services/audio-servic';
import { useState,useEffect } from 'react';
import PlayerView from '../../component/playerControl/player-control';
import { useSelector,useDispatch } from 'react-redux';
import { voiceNoteAdd } from '../../actions/voice-note-action';
const  limit = 30;
const VoiceRecorder = () => {
    const [isRecordingStarted, recordingStarted] = useState(false)
    const [count,setCount] = useState(0)
    const [timerCallback,setTimerCallback] = useState(null)
    const [audioObj,setAudioObj] = useState(null)
    const [textInput,setTextInput] = useState(null)
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.voiceNotes.isLoading)
    useEffect(() => {
        if(isRecordingStarted) {           
            const interval = setInterval(async () => {
                setCount(count => count + 1);              
            }, 1000);
            setTimerCallback(interval)
        } else {
            clearInterval(timerCallback);
            setCount(0)
        }
        return () => {
            clearInterval(timerCallback);
            setCount(0)
        }
      }, [isRecordingStarted]);


      useEffect(() => {          
        if(count >= limit) {
            stopRecording()
            clearInterval(timerCallback);
        }
      },[count])

    const startRecording = () => {   
        audioService.checkAudioPermission().then((res) => {
            if(res) {
                recordingStarted(true)
                audioService.startRecording();
            }            
        })        
    }

    const stopRecording = async () => {
        recordingStarted(false)
        let audioObj = await audioService.stopRecording();           
        if(audioObj) {            
            const audio = {
                file:audioObj,                
            }        
            setAudioObj(audio)      
        }        
    }

    const submitRecording = () => {
        let payload = {
            note:textInput,
            file:audioObj.file,
        }
        setAudioObj(null) 
        setTextInput('')
        voiceNoteAdd(payload,dispatch)       
    }

    const changeTextInput = (event) => {        
        setTextInput(event.target.value)
    }

    return (
        <div className="voice_recorder_wrapper">
            <div className="voice_form">
                <div className="voice_form_title">
                    <div className="first_part">Speak up your ideas</div>
                    <div className="second_part">Add your voice note and share to your friends</div>
                </div>
                <input type="text" value={textInput} placeholder="Your voice note name here..." name="voiceNote" id="voiceNote" className="txt_input" onChange={changeTextInput} />
                <div className="btn_row_recorder">
                    <button type="button" className="btn btn_record" name="btn_record" id="btn_record" onClick={isRecordingStarted ? stopRecording : startRecording}>
                        <img className="img_recording" src={microphoneIcon} draggable="false" />{isRecordingStarted ? 'Stop Recording' : 'Start Recording'}</button>
                    <button type="button" disabled={!textInput || !audioObj} className="btn btn_submit" name="btn_submit" id="btn_submit" onClick={submitRecording}>{isLoading ? 'Submitting...' : 'Submit Note' }</button>
                </div>
                <div className="count_wrapper">
                    {count ? <span className="counter">00:{count > 9 ? count : `0${count}`}</span> : null}                    
                </div>
                <div className="recorded_view">
                    {audioObj ? <PlayerView notes={audioObj} /> : null}                        
                </div>
            </div>
        </div>

    )
}

export default VoiceRecorder