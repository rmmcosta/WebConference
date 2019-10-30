const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://rcwebconference.herokuapp.com/"; // site that doesn’t send Access-Control-*
const baseApiUrl = proxyurl+url;
const conferenceNumber = 1;

let jsonHeaders = new Headers();
jsonHeaders.append('Content-Type', 'application/json');

window.onload = function () {
    console.log("DOM loaded");
    const btnRegister = document.getElementById("btnRegister");
    btnRegisterClick = function () {
        console.log("Register button clicked!")
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
                console.log(inname);
                //get email
                let inmail = $('#txtEmail').val();
                console.log(inmail);
                //register in the database
                const postInit = {
                    method: 'POST',
                    headers: jsonHeaders,
                    mode: 'cors',
                    cache: 'default',
                    body: JSON.stringify({ name:inname, email:inmail})
                };
                console.log('do the fetch at:' + new Date().getTime());
                return fetch(`${baseApiUrl}participants`, postInit)
                    .then(response => { 
                        console.log(response);
                        if (!response.ok) {
                            console.log('response not ok');
                            throw new Error(response.statusText)
                        }
                        return true;
                    })
                    .catch(error => {
                        console.log('error');
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
                        title: `Registered with success!`
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
}