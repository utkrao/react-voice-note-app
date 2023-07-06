import * as type from '../constant/index';


export const playerToggle = (data,dispatch) => {
    dispatch({type: type.PLAYER_TOGGLE,payload:data})       
}