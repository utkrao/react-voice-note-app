import * as type from '../constant';
const initialState = {
   isPlaying:null,
};

const Player = (state = initialState,action) => {
    switch(action.type) {      
        // add voice list
        case type.PLAYER_TOGGLE: {
            return {
                ...state,    
                isPlaying:action.payload,                                     
            };
        }       
        default:
            return state;
    }
}

export default Player
