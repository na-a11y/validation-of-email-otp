// script.js
const API_URL = 'http://localhost:3000';

function registerUser() {
    // Clear previous error messages
    document.getElementById("fullNameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("mobileError").textContent = "";
    document.getElementById("usernameError").textContent = "";
    document.getElementById("passwordError").textContent = "";

    // Get form values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    let valid = true;

    // Validate Full Name
    if (fullName === "") {
        document.getElementById("fullNameError").textContent = "Full Name cannot be empty.";
        valid = false;
    } else if (!/^[A-Z]/.test(fullName)) {
        document.getElementById("fullNameError").textContent = "Full Name must start with an uppercase letter.";
        valid = false;
    }

    // Validate Email
    if (email === "") {
        document.getElementById("emailError").textContent = "Email ID cannot be empty.";
        valid = false;
    } else if (!/.+@.+\..+/.test(email)) {
        document.getElementById("emailError").textContent = "Email ID must contain '@' and '.com'.";
        valid = false;
    }

    // Validate Mobile Number
    if (mobile === "") {
        document.getElementById("mobileError").textContent = "Mobile Number cannot be empty.";
        valid = false;
    } else if (!/^[7-9]\d{9}$/.test(mobile)) {
        document.getElementById("mobileError").textContent = "Mobile Number must start with 7, 8, or 9 and have 10 digits.";
        valid = false;
    }

    // Validate Username
    if (username === "") {
        document.getElementById("usernameError").textContent = "Username cannot be empty.";
        valid = false;
    } else if (!/^[a-z0-9@]{5,10}$/.test(username)) {
        document.getElementById("usernameError").textContent = "Username must be 5-10 characters long and contain only lowercase letters, numbers, and '@'.";
        valid = false;
    }

    // Validate Password
    if (password === "") {
        document.getElementById("passwordError").textContent = "Password cannot be empty.";
        valid = false;
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{10,}/.test(password)) {
        document.getElementById("passwordError").textContent = "Password must be at least 10 characters long and contain uppercase letters, lowercase letters, numbers, and special characters.";
        valid = false;
    }

    if (valid) {
        const user = {
            fullName,
            email,
            mobile,
            username,
            password
        };

        // Send OTP to email
        fetch(`${API_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'OTP sent successfully') {
                document.getElementById("message").textContent = "OTP sent to your email. Please enter the OTP.";
                document.getElementById("otpSection").style.display = "block";
                localStorage.setItem("pendingUser", JSON.stringify(user));
            } else {
                document.getElementById("message").textContent = "Error sending OTP.";
            }
        })
        .catch(error => {
            document.getElementById("message").textContent = "Error sending OTP.";
        });
    }
}

function validateOTP() {
    const email = JSON.parse(localStorage.getItem("pendingUser")).email;
    const otp = document.getElementById("otp").value.trim();

    fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'OTP verified successfully') {
            const user = JSON.parse(localStorage.getItem("pendingUser"));
            storeUser(user);
            document.getElementById("message").textContent = "User registered successfully!";
            document.getElementById("showTableButton").style.display = "block"; // Show the button to display the table
            document.getElementById("otpSection").style.display = "none"; // Hide the OTP section
            localStorage.removeItem("pendingUser");
        } else {
            document.getElementById("otpError").textContent = "Invalid OTP. Please try again.";
        }
    })
    .catch(error => {
        document.getElementById("otpError").textContent = "Error verifying OTP.";
    });
}

function storeUser(user) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

function redirectToUserTable() {
    window.location.href = "userTable.html";
}

// Hide the button on page load
window.onload = function() {
    document.getElementById("showTableButton").style.display = "none";
};
