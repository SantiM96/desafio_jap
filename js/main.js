document.addEventListener("DOMContentLoaded", function () {


    //get the last value of the url. ej: "index.html"
    let urlNumber = window.location.href.split("/").length
    let currentlyUrl = window.location.href.split("/", urlNumber)[urlNumber - 1].split("?")[0].split("#")[0]


    // ----- code according to each page ----- //


    // global-start
    const urlServer = "https://raw.githubusercontent.com/danblanc/jap_projects/main/users.json",
        urlProducts = "https://raw.githubusercontent.com/danblanc/jap_projects/main/products.json"

        function getJSONData(url) {
            let result = {};
            return fetch(url)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }else{
                        throw Error(response.statusText);
                    }
                })
                .then(function(response) {
                    result.status = 'ok';
                    result.data = response;
                    return result;
                })
                .catch(function(error) {
                    result.status = 'error';
                    result.data = error;
                    return result;
                });
        }

        function sessionCheck() {
            // get data users and if there're response continius
            const users = getJSONData(urlServer)
            users.then(result => {
                // if there're response
                usersArray = result.data

                const userLocal = localStorage.getItem("user"),
                    firstNameLocal = localStorage.getItem("first_name"),
                    lastNameLocal = localStorage.getItem("last_name"),
                    interestLocal = localStorage.getItem("interest")
                let userLoged = false
                
                for (userServer of usersArray) {
                    if ( userLocal == userServer.user &&
                         firstNameLocal == userServer.first_name &&
                         lastNameLocal == userServer.last_name &&
                         interestLocal == userServer.interest ) {
                        userLoged = true
                    }
                }

                if (!userLoged) {
                    location.href = "login.html"
                }
            })
            let answer = {
                user: localStorage.getItem("user"),
                first_name: localStorage.getItem("first_name"),
                last_name: localStorage.getItem("last_name"),
                interest: localStorage.getItem("interest")
            }
            return answer
        }
    
        function sessionClose() {
            localStorage.removeItem("user"),
            localStorage.removeItem("first_name"),
            localStorage.removeItem("last_name"),
            localStorage.removeItem("interest")
        }

    // global-end
    

    // Login-start
    if (currentlyUrl == "login.html") {
        sessionClose()
        const btnLogin = document.querySelector('#submit')

        // get data users and if there're response continius
        const users = getJSONData(urlServer)
        users.then(result => {
            // if there're response
            usersArray = result.data
            
            btnLogin.onclick = e => {
                e.preventDefault()

                localStorage.removeItem("user")
                localStorage.removeItem("first_name")
                localStorage.removeItem("last_name")
                localStorage.removeItem("interest")

                const userInput = document.querySelector('#user'),
                    passwordInput = document.querySelector('#password')
                
                if (userInput.value.trim() == "" || passwordInput.value.trim() == "") {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Espera!',
                        text: 'Ambos campos son obligatorios'
                    })
                    return
                }
                
                for (userServer of usersArray) {
                    if (userInput.value == userServer.user) {
                        console.log(userInput.value)
                        if (passwordInput.value == userServer.password) {
                            localStorage.setItem("user", userServer.user)
                            localStorage.setItem("first_name", userServer.first_name)
                            localStorage.setItem("last_name", userServer.last_name)
                            localStorage.setItem("interest", userServer.interest)
                        }
                    }
                }

                if (localStorage.getItem("user") != null) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logeado',
                        text: 'Te has logeado exitosamente'
                    }).then(() => location.href = "index.html")
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Usuario o contraseña incorrecta'
                    })
                }
                
            }
        })
    }  
    // Login-end


    // Index-start
    if (currentlyUrl == "index.html" || currentlyUrl == "") {
        // check session (localStorage) and redirect to login if there is no
        const userData = sessionCheck()

        // delete localStorage if the user close the session 
        document.querySelector('#sessionClose').onclick = e => {
            e.preventDefault()
            sessionClose()
            location.href = "index.html"
        }

        Swal.fire({
            title: `Bienvenido ${userData.first_name} ${userData.last_name}`,
            text: '¡Mira lo que hemos seleccionado para ti!'
        })


        // get data users and if there're response continius
        const users = getJSONData(urlProducts)
        users.then(result => {
            productsArray = result.data
            for (product of productsArray) {
                if (userData.interest == product.type) {
                    document.getElementById('insert').innerHTML += `
                        <div class="d-sm-flex border border-2 border-dark rounded height">
                            <div class="col-12 col-sm-3 mx-sm-auto my-0 d-sm-flex">
                                <img class="w-100" src="${product.img}" alt="imagre">
                            </div>
                            <div class="col-12 col-sm-9 container my-2">
                                <h3>${product.product}</h3>
                                <p>${product.currency} ${product.cost}</p>
                            </div>
                        </div>
                    `
                }
            }
            
        }) 
    }
    // Index-end

});