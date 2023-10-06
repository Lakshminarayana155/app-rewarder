
// Get the CSRF token from the cookie
function getCSRFToken() {
    const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenElement) {
        return csrfTokenElement.value;
    }
    return null;
}

document.getElementById("userLoginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Get the CSRF token
    const csrfToken = getCSRFToken();

    if (!csrfToken) {
        console.error("CSRF token not found.");
        return;
    }
    
    fetch("api/user-login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        const loginMsg = document.getElementById("loginMsg");
        if (data.token) {
            localStorage.setItem("token", data.token);
            loginMsg.innerHTML = "User LogIn successfull. Redirecting...";
            // Clear form data and login message after 2 seconds
            setTimeout(function () {
                document.getElementById("userLoginForm").reset();
                loginMsg.innerHTML = "";
            }, 499);

            // Redirect after 3 seconds
            setTimeout(function () {
                window.location.href = "user_page/";
            }, 500);
        } else {
            loginMsg.innerHTML = data;
        } 
    })
    .catch(error => {
        console.error("LogIn failed:", error);
    });
});
