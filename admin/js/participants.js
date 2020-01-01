const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(()=>{
    const divParticipants = $('#divParticipants');
    // '/conferences/:idconf/participants' 0 means all
    fetch(`${baseApiUrl}/conferences/0/participants`)
    .then(participants=>{
        console.log(participants);
    })
    .catch(error=>{
        console.error(error);
    });
});