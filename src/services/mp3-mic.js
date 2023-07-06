import AudioContext from '../audio-lib/AudioContext'
import { Recorder } from '../audio-lib/vmsg';

let analyser
let audioCtx
let mediaRecorder
let chunks = []
let startTime
let stream
let mediaOptions = {
  audioBitsPerSecond: 128000,
  mimeType: 'audio/mp3',
}
let timeInterval
// online url
// const shimURL = 'https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js'
// const wasmURL = 'https://unpkg.com/vmsg@0.3.0/vmsg.wasm'
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

export class MicrophoneRecorderMp3 {
  startRecording = async () => {    
    console.log('start recording from MicrophoneRecorderMp3')
    startTime = Date.now()
    if (mediaRecorder) {
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume()
      }

      if (mediaRecorder && mediaRecorder.state === 'paused') {
        mediaRecorder.resume()
        return
      }

      if (audioCtx && mediaRecorder && mediaRecorder.state === 'inactive') {
        mediaRecorder.start(10)
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(analyser)
      }
    } else if (navigator.mediaDevices) {
      console.log('getUserMedia supported.');             
        var constraints = { audio: true, video:false }
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(async str => {
            console.log("str.......",str)
            stream = str
            mediaOptions['constraints'] = constraints
            mediaRecorder = new Recorder({
              wasmURL: './lib/vmsg.wasm',
              shimURL:'./lib/wasm-polyfill.js',
              ...mediaOptions,
            })
            console.log("mediaRecorder",mediaRecorder)
            try {
              await mediaRecorder.init()
              audioCtx = AudioContext.getAudioContext()
              audioCtx.resume().then(() => {                
                mediaRecorder.startRecording()
                timeInterval = setInterval(() => {
                  console.log('chunks load')
                }, 10)
                const sourceNode = audioCtx.createMediaStreamSource(stream)                
              })
            } catch (error) {
              // console.log(JSON.stringify(error, 2, null))
            }
          })
          .catch(error => console.log(JSON.stringify(error, 2, null)))
   
    } else {
      alert('Your browser does not support audio recording')
    }
  }

  async stopRecording() {
    console.log('<=== onStop === >')
    return new Promise(async (resolve, reject) => {
      try {
        if (mediaRecorder) {
          mediaRecorder.stopTracks()      
          const blob = await mediaRecorder.stopRecording()
          const blobObject = {
            blob,
            startTime,
            stopTime: Date.now(),
            options: mediaOptions,
            blobURL: window.URL.createObjectURL(blob),
          }
          console.log("blobObject",blobObject)
          mediaRecorder.close()
          mediaRecorder = null
          clearInterval(timeInterval)
          resolve(blobObject)
        } else {
          resolve(false)
        }
      } catch (error) {
        resolve(false)
      }
    })
  }
}
