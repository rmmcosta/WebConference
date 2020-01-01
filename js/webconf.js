const proxyurl = "https://cors-anywhere.herokuapp.com";
const url = "https://rcwebconference.herokuapp.com"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl + '/' + url;
const conferenceNumber = 1;

let jsonHeaders = new Headers();
jsonHeaders.append('Content-Type', 'application/json');


//on dom loaded
window.onload = function () {
    //console.log("DOM loaded");

    //register participant
    const btnRegister = document.getElementById("btnRegister");
    btnRegisterClick = function () {
        //console.log("Register button clicked!")
        //open modal
        Swal.fire({
            title: 'WebConference',
            html: '' +
                '<input id="txtName" type="text" class= "swal2-input" placeholder="name">' +
                '<input id="txtEmail" type="email" class="swal2-input" placeholder="email">' +
                '',
            confirmButtonText: 'Register',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                //get name
                let inname = $('#txtName').val();
                //console.log(inname);
                //get email
                let inmail = $('#txtEmail').val();
                //console.log(inmail);
                //register in the database
                const postInit = {
                    method: 'POST',
                    headers: jsonHeaders,
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify({ name: inname })
                };
                //console.log('do the fetch at:' + new Date().getTime());
                return fetch(`${baseApiUrl}/conferences/${conferenceNumber}/participants/${inmail}`, postInit)
                    .then(response => response.text())
                    .then(data => {
                        //console.log(data);
                        if (!data) {
                            //console.log('response not ok');
                            throw new Error(response.statusText)
                        }
                        return data;
                    })
                    .catch(error => {
                        //console.log('error');
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value) {
                if (!result.value.err_code) {
                    Swal.fire({
                        title: result.value
                    })

                } else {
                    Swal.fire({
                        title: `${result.value.err_message}`
                    })
                }
            }
        })
    }
    btnRegister.addEventListener("click", btnRegisterClick);

    //get speakers
    (async () => {
        try {
            const speakers = await getSpeakers(`${baseApiUrl}/conferences/${conferenceNumber}/speakers`);
            //console.log(JSON.stringify(speakers)); // JSON-string from `response.json()` call= 
            let renderSpeakers = document.getElementById('renderSpeakers');
            renderSpeakers.innerHTML = getSpeakersHtml(speakers);
            await addSpeakerPhotos();
        } catch (error) {
            console.error(error);
        }

        async function getSpeakers(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: jsonHeaders,
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
            });
            return await response.json(); // parses JSON response into native JavaScript objects
        }

        function getSpeakersHtml(speakers) {
            let htmlSpeakers = '<div class="row text-center">';
            for (let speaker in speakers) {
                let name = speakers[speaker].name;
                let bio = speakers[speaker].bio;
                htmlSpeakers = htmlSpeakers + '<div class="col-sm-4">';
                htmlSpeakers = htmlSpeakers + '<img onclick="showSpeakerPopup(this)" class="mx-auto rounded-circle" src="./img/spinner.gif" style="width:150px;height:150px;" alt=""></img>';
                htmlSpeakers = htmlSpeakers + `<h4 onclick="showSpeakerPopup(this)" class="speaker-name">${name}</h4>`;
                htmlSpeakers = htmlSpeakers + `<p class="text-muted">${bio}</p>`;
                htmlSpeakers = htmlSpeakers + '<ul class="list-inline social-buttons">';
                htmlSpeakers = htmlSpeakers + '<li class="list-inline-item"><a href="#"><i class="fab fa-twitter"></i></a></li>';
                htmlSpeakers = htmlSpeakers + '<li class="list-inline-item"><a href="#"><i class="fab fa-facebook"></i></a></li>';
                htmlSpeakers = htmlSpeakers + '<li class="list-inline-item"><a href="#"><i class="fab fa-linkedin-in"></i></a></li>';
                htmlSpeakers = htmlSpeakers + '</ul>';
                htmlSpeakers = htmlSpeakers + '</div>';
            }
            htmlSpeakers = htmlSpeakers + '</div>';
            //console.log(htmlSpeakers);
            return htmlSpeakers;
        }

    })();

    //get sponsors
    (async () => {
        try {
            const sponsors = await getSponsors(`${baseApiUrl}/conferences/${conferenceNumber}/sponsors`);
            //console.log(JSON.stringify(sponsors)); // JSON-string from `response.json()` call= 
            let renderSponsors = document.getElementById('renderSponsors');
            renderSponsors.innerHTML = getSponsorsHtml(sponsors);
        } catch (error) {
            console.error(error);
        }

        async function getSponsors(url = '') {
            // Default options are marked with *
            const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: jsonHeaders,
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
            });
            return await response.json(); // parses JSON response into native JavaScript objects
        }

        function getSponsorsHtml(sponsors) {
            let htmlSponsors = '<div class="row text-center">';
            for (let sponsor in sponsors) {
                let name = sponsors[sponsor].name;
                let logo = sponsors[sponsor].logo;
                let category = sponsors[sponsor].category;
                let link = sponsors[sponsor].link;
                htmlSponsors = htmlSponsors + '<div class="col-md-3 col-sm-3">';
                htmlSponsors = htmlSponsors + `<a href="https://${link}" target="_blank">`;
                htmlSponsors = htmlSponsors + '<img class="img-fluid d-block mx-auto" src=".' + logo + '" style="width:200px;height:80px;" alt="' + name + '"></img>';
                htmlSponsors = htmlSponsors + `<h4 class="sponsor-name">${name}</h4>`;
                htmlSponsors = htmlSponsors + '</a>';
                htmlSponsors = htmlSponsors + `<p class="text-muted">${category}</p>`;
                htmlSponsors = htmlSponsors + '</div>';
            }
            htmlSponsors = htmlSponsors + '</div>';
            //console.log(htmlSponsors);
            return htmlSponsors;
        }

    })();

    //on contact submit
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', async (event) => {
        //need to prevent the default behavior, otherwise the page will be reloaded
        event.preventDefault();
        let inputName = document.getElementById('contactName');
        let inputEmail = document.getElementById('contactEmail');
        let inputPhone = document.getElementById('contactPhone');
        let inputMsg = document.getElementById('contactMessage');
        let btnSendMessage = document.getElementById('btnSendMessage');
        let btnSendMessageOrigInnerHtml = btnSendMessage.innerHTML;

        buttonStartLoading(btnSendMessage, btnSendMessageOrigInnerHtml);

        let inputedName = inputName.value;
        let inputedEmail = inputEmail.value;
        let inputedPhone = inputPhone.value;
        let inputedMsg = inputMsg.value;

        const bodyRequest = JSON.stringify({
            email: inputedEmail,
            name: inputedName,
            phone: inputedPhone,
            msg: inputedMsg
        });
        //console.log('body request:', bodyRequest);
        const response = await fetch(`${baseApiUrl}/contacts/emails`, {
            method: 'POST',
            headers: jsonHeaders,
            mode: 'cors',
            cache: 'default',
            body: bodyRequest
        });
        //console.log(response);
        const result = await response.json();
        this.buttonStopLoading(btnSendMessage, btnSendMessageOrigInnerHtml);
        //console.log('submit result:', result);
        if (result.success) {
            // clear the form and go back to the top of the page
            Swal.fire({
                type: 'success',
                title: 'Contact received',
                text: result.message.eng,
                showConfirmButton: false,
                timer: 1500,
                onClose: () => {
                    contactForm.reset();
                }
            });
        } else {
            let listErrors = "Something went wrong!";
            if (!!result.errors) {
                listErrors = '';
                result.errors.forEach(element => {
                    listErrors += `<span>${element.param.toUpperCase()} - ${element.msg}: "${element.value}"</span>`
                });
            }
            if (!!result.message) {
                listErrors = result.message;
            }
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                html: listErrors,
                confirmButtonText: 'Try again'
            });
        }
    });

    //login to private area
    const linkPrivateArea = document.getElementById('linkPrivateArea');
    linkPrivateArea.addEventListener('click', () => {
        Swal.fire({
            title: 'WebConference Backoffice',
            html:
                '<input id="loginEmail" placeholder="email" type="email" class="swal2-input">' +
                '<input id="loginPassword" placeholder="password" type="password" class="swal2-input">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Enter',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                let loginEmail = document.getElementById('loginEmail').value;
                let loginPwd = document.getElementById('loginPassword').value;
                console.log(loginEmail, loginPwd);
                console.log(baseApiUrl);
                return fetch(`${baseApiUrl}/signin`, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: `email=${loginEmail}&password=${loginPwd}`
                })
                    .then(response => {
                        console.log(response);
                        if (!response.ok) {
                            console.log('auth not ok');
                            throw new Error(response.statusText)
                        }
                        return true;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log('auth result:',result);
            if (result) {
                window.location.replace("admin/html/participants.html")
            } else {
                Swal.fire({ title: `An error has ocurred!` })
            }
        });
    });
}
//end of on dom loaded function

async function addSpeakerPhotos() {
    //console.log('add speaker photos');
    const imgs = document.querySelectorAll("#renderSpeakers .row img");
    //console.log(imgs);
    for (img in imgs) {
        await getRandomPhoto(imgs[img]);
    };
}

async function getRandomPhoto(img) {
    //console.log('get random photo');
    //console.log(img);
    fetch('https://picsum.photos/300/300')
        .then(response => response.blob())
        .then(function (imgblob) {
            //console.log(imgblob);
            let objectURL = URL.createObjectURL(imgblob);
            img.src = objectURL;
        });
}

function showSpeakerPopup(elem) {
    //console.log(elem.parentElement);
    let div = elem.parentElement;
    let name = div.getElementsByTagName('h4')[0].innerText;
    let bio = div.getElementsByTagName('p')[0].innerText;
    let photo = div.getElementsByTagName('img')[0].src;

    Swal.fire({
        title: name,
        text: bio,
        imageUrl: photo,
        imageHeight: 300,
        imageWidth: 300,
        imageAlt: name + ' profile picture.',
        animation: false
    })
};

function buttonStartLoading(btnElement, originalInnerHtml) {
    btnElement.disabled = true;
    btnElement.innerHTML = '<div class="fa fa-spin fa-spinner"></div> ' + originalInnerHtml;
}

function buttonStopLoading(btnElement, originalInnerHtml) {
    btnElement.disabled = false;
    btnElement.innerHTML = originalInnerHtml;
}

//to use by the google maps
// Initialize and add the map
function initMap() {
    // The location of guimaraes
    let guima = { lat: 41.44443, lng: -8.29619 };//41.44443, -8.29619
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('googlemap'), { zoom: 12, center: guima });
    // The marker, positioned at Uluru
    let marker = new google.maps.Marker({ position: guima, map: map, title: "WebConference" });

    let infoWindow = new google.maps.InfoWindow({
        content: "This is my hometown."
    });

    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });
}
