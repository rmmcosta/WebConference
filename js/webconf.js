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
                return fetch(`//api`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json()
                    })
                    .catch(error => {
                        Swal.showValidationMessage(
                            `Request failed: ${error}`
                        )
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.value) {
                if(!result.value.err_code){
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