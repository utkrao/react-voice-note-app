import * as type from '../constant/index';
import indexDBService from '../services/local-storage';
import toastService, { toastType } from '../services/toast.service';
import { blobToArrayBuffer, arrayBufferToBlob } from '../utils/converter';
let mediaOptions = {
    audioBitsPerSecond: 128000,
    mimeType: 'audio/mp3',
}
export const voiceNoteListRequest = (dispatch) => {
    dispatch({ type: type.VOICE_LIST_REQUESTED })
    const successCallback = (list) => {
        Promise.all(list.map(async item => {
            const blob = await arrayBufferToBlob(item.buffer, 'audio/mp3');
            const blobObject = {
                blob,
                options: mediaOptions,
                blobURL: window.URL.createObjectURL(blob),
            }
            item.file = blobObject
            return item
        })).then(res => {
            console.log(res)
            setTimeout(() => {
                dispatch({
                    type: type.VOICE_LIST_COMPLETED, payload: {
                        voiceNoteList: list
                    }
                })
            }, 2000)
        })
    }
    indexDBService.fetchVoiceNotes(successCallback)
}

export const voiceNoteAdd = async (data, dispatch) => {
    dispatch({ type: type.VOICE_ADD_REQUESTED })
    const successCallback = (isAdded) => {
        setTimeout(() => {
            if (isAdded) {
                toastService.showToast("Voice note Added Successfully !!", toastType.info)
                dispatch({ type: type.VOICE_ADD_COMPLETED })
            } else {
                toastService.showToast("There some error in DB. Please Try Again !!", toastType.error)
                dispatch({ type: type.VOICE_LIST_ERROR, payload: { error: "There some error in DB" } })
            }
        }, 2000)
    }
    let arrayBUffer = await blobToArrayBuffer(data.file.blob);
    indexDBService.createVoiceNotes(data.note, data.file, arrayBUffer, successCallback)
}

export const voiceNoteDelete = (data, dispatch) => {
    dispatch({ type: type.VOICE_DELETE_REQUESTED, payload: data })
    const successCallback = (isDeleted) => {
        setTimeout(() => {
            if (isDeleted) {
                toastService.showToast("Voice note Deleted Successfully !!", toastType.info)
                dispatch({ type: type.VOICE_DELETE_COMPLETED, payload: data })
            } else {
                toastService.showToast("There some error in DB. Please Try Again !!", toastType.error)
                dispatch({ type: type.VOICE_LIST_ERROR, payload: { error: "There some error in DB" } })
            }
        }, 2000)
    }
    indexDBService.deleteVoiceNotes(data.timestamp, successCallback)
}