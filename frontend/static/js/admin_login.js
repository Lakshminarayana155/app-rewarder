
// Get the CSRF token from the cookie
function getCSRFToken() {
    const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenElement) {
        return csrfTokenElement.value;
    }
    return null;
}

document.getElementById("adminLoginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Get the CSRF token
    const csrfToken = getCSRFToken();

    if (!csrfToken) {
        console.error("CSRF token not found.");
        return;
    }
    
    fetch("api/admin-login/", {
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
        if (data.a_token) {
            localStorage.setItem("a_token", data.a_token);
            loginMsg.innerHTML = "Admin LogIn successfull. Redirecting...";
            setTimeout(function () {
                document.getElementById("adminLoginForm").reset();
                loginMsg.innerHTML = "";
            }, 0999);

            setTimeout(function () {
                window.location.href = "admin_page/";
            }, 1000);
        } else {
            loginMsg.innerHTML = data;
        } 
    })
    .catch(error => {
        console.error("LogIn failed:", error);
    });
});
