// =========================================
// REGISTER USER
// =========================================

function registerUser(event) {

    // Stop form from refreshing
    event.preventDefault();


    // =====================================
    // GET FORM VALUES
    // =====================================

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms =
        document.getElementById("terms").checked;



    // =====================================
    // VALIDATION
    // =====================================

    if (name === "") {

        alert("Please enter your full name.");

        return;
    }


    // Email validation

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;
    }


    // Phone validation

    const phonePattern =
        /^[0-9]{10}$/;


    if (!phonePattern.test(phone)) {

        alert("Phone number must contain exactly 10 digits.");

        return;
    }


    // Password validation

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;
    }


    // Confirm password

    if (password !== confirmPassword) {

        alert("Password and Confirm Password do not match.");

        return;
    }


    // Terms validation

    if (!terms) {

        alert("Please agree to the Terms & Conditions.");

        return;
    }



    // =====================================
    // GET EXISTING USERS
    // =====================================

    let users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];



    // =====================================
    // CHECK EMAIL ALREADY EXISTS
    // =====================================

    const existingUser =
        users.find(function (user) {

            return user.email.toLowerCase() ===
                email.toLowerCase();

        });


    if (existingUser) {

        alert("This email is already registered.");

        return;
    }



    // =====================================
    // CREATE USER OBJECT
    // =====================================

    const newUser = {

        name: name,

        email: email,

        phone: phone,

        password: password

    };



    // =====================================
    // SAVE USER
    // =====================================

    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );



    // =====================================
    // SUCCESS MESSAGE
    // =====================================

    alert(
        "✅ Account created successfully!\n\nYou can now login."
    );



    // =====================================
    // GO TO LOGIN PAGE
    // =====================================

    window.location.href =
        "login.html";

}