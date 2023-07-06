import * as type from '../constant';
const initialState = {
    success: false,
    isLoading: false,    
    voiceNoteList: [],
    error:null,    
    from:''
};

const VoiceNotes = (state = initialState,action) => {
    switch(action.type) {
        // voice list
        case type.VOICE_LIST_REQUESTED: {            
            return {
                ...state,     
                success:false,           
                isLoading: true,    
                from:'list'                                     
            };
        }
        case type.VOICE_LIST_COMPLETED: {
            return {
                ...state,     
                success:true,           
                isLoading: false,   
                voiceNoteList:action.payload.voiceNoteList,
                from:'list'                        
            };
        }

        case type.VOICE_LIST_ERROR: {
            return {
                ...state,      
                success:true,                     
                isLoading: false,  
                error:action.payload.error                              
            };
        }

        // add voice list
        case type.VOICE_ADD_REQUESTED: {
            return {
                ...state,    
                success:false,                       
                isLoading: true,   
                from:'add'                             
            };
        }
        case type.VOICE_ADD_COMPLETED: {
            return {
                ...state,   
                success:true,                        
                isLoading: false,  
                from:'add'                                             
            };
        }

          // delete voice list
        case type.VOICE_DELETE_REQUESTED: {
            return {
                ...state,    
                success:false,                       
                isLoading: action.payload,  
                from:'delete'                                 
            };
        }
        case type.VOICE_DELETE_COMPLETED: { 
            let list = []                       
            if(state?.voiceNoteList && state?.voiceNoteList.length > 0 && action.payload?.timestamp) {
                let key = action.payload.timestamp;
                list = [...state?.voiceNoteList];
                let index = list.findIndex((item) => item.timestamp == key)
                if(index != -1) {
                    list.splice(index,1)
                }
            }
            return {
                ...state,   
                success:true,                        
                isLoading: false, 
                from:'delete',
                voiceNoteList:list && list.length > 0 ? list : [],                                           
            };
        }
        default:
            return state;
    }
}

export default VoiceNotes
