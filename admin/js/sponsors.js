const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
    renderSponsors();
    addActions();
});

async const renderSponsors = () => {
    const divSponsors = $('#divSponsors');
    // '/conferences/:idconf/participants' 0 means all
    fetch(`${baseApiUrl}/conferences/0/sponsors`)
        .then((response) => response.json())
        .then(sponsors => {
            console.log(sponsors);
            let table = `<table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Logo</th>
            <th scope="col">Category</th>
            <th scope="col">Link</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>`;
            sponsors.forEach(element => {
                table += `<tr>
            <th scope="row">${element.id}</th>
            <td>${element.name}</td>
            <td>${element.logo}</td>
            <td>${element.category}</td>
            <td><a href="${element.link}">${element.link}</a></td>
            <td><i class="deleteIcon far fa-trash-alt" data-id="${element.id}"></i></td>
          </tr>`;
            });

            table += '</tbody></table>';
            divSponsors.html(table);


        })
        .catch(error => {
            console.error(error);
        });
}

const addActions = () => {
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
                ///conferences/:idconf/sponsors/:idsponsor
                fetch(`${baseApiUrl}/conferences/1/sponsors/${id}`, deleteOptions)
                    .then((response) => {
                        console.log(response);
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'The record has been deleted.',
                                'success'
                            )
                        }
                        await renderSponsors();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        })
    });
}