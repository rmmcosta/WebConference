import {baseApiUrl} from '../../js/webconf.js'

//on document ready
$(()=>{
    const divParticipants = $('#divParticipants');
    // '/conferences/:idconf/participants' 0 means all
    fetch(`${baseApiUrl}/0/participants`)
    .then(participants=>{
        console.log(participants);
    })
    .catch(error=>{
        console.error(error);
    });
});