const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
    init();
    const btnLogout = $('#btnLogout');
    btnLogout.click(() => {
        console.log('click logout!');
        logout();
        console.log('Logged out!');
    });
    const btnSaveSpeaker = $('#btnSaveSpeaker');
    btnSaveSpeaker.click(() => {
        console.log('save speaker clicked');
        addSpeaker();
    });
});

function addSpeaker() {
    // '/conferences/:idconf/speakers/:idspeaker'
    let data = {
        id: $('#speakerId').val(),
        name: $('#speakerName').val(),
        filliation: $('#speakerFilliation').val(),
        bio: $('#speakerBio').val(),
        link: $('#speakerLink').val()
    };
    let jsonHeaders = new Headers();
    jsonHeaders.append('Content-Type', 'application/json');
    let postOptions = {
        method: 'POST',
        headers: jsonHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(data)
    };
    console.log(postOptions);
    fetch(`${baseApiUrl}/conferences/1/speakers/${data.id}`, postOptions)
        .then(response => {
            console.log(response);
            if (response.ok) {
                renderSpeakers();
                $('#btnCloseSpeakerModal').trigger("click");
                $("form")[1].reset();
            }
        })
        .catch(error => {
            console.log(error);
        });
}

async function init() {
    await renderSpeakers();
}

async function logout() {
    let getOptions = {
        method: 'GET'
    };
    ///conferences/:idconf/participants/:idparticipant
    console.log(`${baseApiUrl}/logout`);
    fetch(`${baseApiUrl}/logout`, getOptions)
        .then(response => {
            console.log(response);
            if (response.ok) {
                window.location.href = "https://rmmcosta.github.io/WebConference/";
            }
        });
}

async function renderSpeakers() {
    const divSpeakers = $('#divSpeakers');
    // '/conferences/:idconf/participants' 0 means all
    let response = await fetch(`${baseApiUrl}/conferences/0/speakers`);
    let speakers = await response.json();
    console.log(speakers);
    let table = `<table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Filliation</th>
            <th scope="col">Bio</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>`;
    speakers.forEach(element => {
        table += `<tr>
            <th scope="row">${element.id}</th>
            <td><a href="#" class="speakerEdit" data-id="${element.id}">${element.name}</a></td>
            <td>${element.filliation}</td>
            <td>${element.bio}</td>
            <td><i class="deleteIcon far fa-trash-alt" data-id="${element.id}"></i></td>
          </tr>`;
    });

    table += '</tbody></table>';
    divSpeakers.html(table);

    addActions();
}

async function addActions() {
    $('.deleteIcon').click((event) => {
        console.log(event);
        let id = $(event.target).data('id');
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                //fetch delete
                let deleteOptions = {
                    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                    mode: 'cors', // no-cors, *cors, same-origin
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    credentials: 'same-origin', // include, *same-origin, omit
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow', // manual, *follow, error
                    referrerPolicy: 'no-referrer', // no-referrer, *client
                };
                ///conferences/:idconf/speakers/:idspeaker
                fetch(`${baseApiUrl}/conferences/1/speakers/${id}`, deleteOptions)
                    .then((response) => {
                        console.log(response);
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'The record has been deleted.',
                                'success'
                            )
                        }
                        renderSpeakers();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        })
    });
    //  edit option
    $('.speakerEdit').click(event => {
        console.log(event);
        let id = $(event.target).data('id');
        fetch(`${baseApiUrl}/conferences/1/speakers/${id}`, { method: 'GET' })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                console.log(response[0]);
                $('#speakerId').val(response[0].id);
                $('#speakerName').val(response[0].name);
                $('#speakerFilliation').val(response[0].filliation);
                $('#speakerBio').val(response[0].bio);
                $('#speakerLink').val(response[0].link);
                let btnNewSpeaker = $('#newSpeaker');
                btnNewSpeaker.trigger('click');
            })
            .catch(error => {
                console.log(error);
            });
    });
}