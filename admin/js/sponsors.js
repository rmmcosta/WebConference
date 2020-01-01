const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;

//on document ready
$(() => {
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
          </tr>
        </thead>
        <tbody>`;
            sponsors.forEach(element => {
                table += `<tr>
            <th scope="row">${element.id}</th>
            <td>${element.name}</td>
            <td>${element.logo}</td>
            <td>${element.category}</td>
            <td>${element.link}</td>
          </tr>`;
            });

            table += '</tbody></table>';
            divSponsors.html(table);
        })
        .catch(error => {
            console.error(error);
        });
});