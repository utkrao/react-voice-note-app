import { combineReducers } from "redux";
import voiceNotes from './voicenote-reducer';
import player from './player-reducer';


const voiceNoteReducer = combineReducers({
    voiceNotes,
    player,
});

export default voiceNoteReducer;
