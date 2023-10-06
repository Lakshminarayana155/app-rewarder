
// Get the CSRF token from the cookie
function getCSRFToken() {
    const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    if (csrfTokenElement) {
        return csrfTokenElement.value;
    }
    return null;
}

document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    // Get the CSRF token
    const csrfToken = getCSRFToken();

    if (!csrfToken) {
        console.error("CSRF token not found.");
        return;
    }
    
    // Make a POST request to the registration endpoint with the CSRF token
    fetch("api/user-register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken 
        },
        body: JSON.stringify({
            username: username,
            password1: password1,
            password2: password2
        })
    })
    .then(response => response.json())
    .then(data => {
        const registrationMsg = document.getElementById("registrationMsg");
        if (data === "User Registered successfully") {
            registrationMsg.innerHTML = "User Registered successfully. Redirecting...";
            setTimeout(function () {
                window.location.href = "{% url 'home' %}";
            }, 2000);
            
        } else {
            registrationMsg.innerHTML = data;
        }
    })
    .catch(error => {
        console.error("Registration failed:", error);
    });
});
