import { MicrophoneRecorderMp3 } from './mp3-mic';
import audioURL from './../connected.wav';
import toastService, { toastType } from '../services/toast.service';
export class AudioDetail {    
    mp3MicRecorder = null;    
    constructor() {
        this.mp3MicRecorder = new MicrophoneRecorderMp3();
    }

    startRecording = async () => {        
        this.mp3MicRecorder.startRecording();
        toastService.showToast("Recording Started", toastType.info)
        this.recordSoundPlay()
    }

    recordSoundPlay = async () => {        
        this.timerCount = 0       
        const sound = new Audio(audioURL)
        sound.play() 
    }


    stopRecording = async () => {        
        let data = await this.mp3MicRecorder.stopRecording()                
        toastService.showToast("Recording Stopped", toastType.info)        
        return data
    }
   
    getTimerCount = () => {
        return this.timerCount;
    }

    checkAudioPermission = () => {        
        return new Promise((resolve) => {
            var constraints = { audio: true, video:false };
            navigator.mediaDevices.getUserMedia(constraints)
            .then(str => {
                if(str && str.id) {
                    resolve(true)
                } else {
                    resolve(false)
                }                
            }).catch((ex) => resolve(false));
        })        
    }
}

export default  new AudioDetail();
