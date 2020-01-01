const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
    const divParticipants = $('#divParticipants');
    // '/conferences/:idconf/participants' 0 means all
    fetch(`${baseApiUrl}/conferences/0/participants`)
        .then((response) => response.json())
        .then((participants) => {
            console.log(participants);
            let table = `<table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>`;
            participants.forEach(element => {
                table += `<tr>
            <th scope="row">${element.id}</th>
            <td>${element.name}</td>
            <td>${element.email}</td>
          </tr>`;
            });

            table += '</tbody></table>';
            divParticipants.html(table);
        })
        .catch(error => {
            console.error(error);
        });
});