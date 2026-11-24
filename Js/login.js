function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    // Get registered users
    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    // Find user
    const user = users.find(function (user) {

        return (
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        );

    });


    // Login successful
    if (user) {

        // Save login status
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify({
                name: user.name,
                email: user.email,
                phone: user.phone
            })
        );

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );



        // Dashboard
        window.location.href = "dashboard.html";

    }

    // Login failed
    else {

        alert("Invalid email or password ❌");

    }

}
