const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
    init();
});

async function init() {
    await renderSpeakers();
    addActions();
}

async function renderSpeakers() {
    const divSpeakers = $('#divSpeakers');
    // '/conferences/:idconf/participants' 0 means all
    fetch(`${baseApiUrl}/conferences/0/speakers`)
        .then((response) => response.json())
        .then(speakers => {
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
            <td>${element.name}</td>
            <td>${element.filliation}</td>
            <td>${element.bio}</td>
            <td><i class="deleteIcon far fa-trash-alt" data-id="${element.id}"></i></td>
          </tr>`;
            });

            table += '</tbody></table>';
            divSpeakers.html(table);
        })
        .catch(error => {
            console.error(error);
        });
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
}