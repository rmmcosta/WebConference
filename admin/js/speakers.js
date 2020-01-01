const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
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
          </tr>
        </thead>
        <tbody>`;
            speakers.forEach(element => {
                table += `<tr>
            <th scope="row">${element.id}</th>
            <td>${element.name}</td>
            <td>${element.filliation}</td>
            <td>${element.bio}</td>
          </tr>`;
            });

            table += '</tbody></table>';
            divSpeakers.html(table);
        })
        .catch(error => {
            console.error(error);
        });
});