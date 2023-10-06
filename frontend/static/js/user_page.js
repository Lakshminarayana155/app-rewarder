
window.onload = function() {
    showContent('Home', document.querySelector('.active'));
};

function fetchProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage.");
        return;
    }

    // Set up the headers with the Authorization token
    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    // Set up the fetch request with the headers
    const requestOptions = {
        method: 'GET',
        headers: headers
    };

    // Make the fetch request to the user-profile endpoint
    fetch("/api/user-profile/", requestOptions)
        .then(response => response.json())
        .then(data => {
            // Get the user's username and points from the response
            const username = data.username;
            const points = data.points;

            // Replace the content in the 'pageTitle' element with the username
            const pageTitle = document.getElementById('pageTitle');
            pageTitle.innerText = `Hello, ${username}!`;

            // Replace the content in the 'contentProfile' element with a personalized message
            const contentProfile = document.getElementById('contentProfile');
            contentProfile.innerHTML = `
                <h2>Profile</h2>
                <h5>Hello ${username},</h5>
                <h6>Congratulations! You have earned ${points} points.</h6>
            `;

            
            // Replace the content in the 'contentPoints' element with the points
            const contentPoints = document.getElementById('contentPoints');
            contentPoints.innerHTML = `<h5>Reward points you won: ${points}</h5><br><h6>Complete more Tasks from the Home and get Extra Reward points</h6> `;
            
            // Show the 'contentProfile' and 'contentPoints' elements
            contentProfile.style.display = 'none';
            contentPoints.style.display = 'none';
            
        })
        .catch(error => {
            console.error('Error fetching user profile data:', error);
        });
}

//Fetching user data through API's with DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    fetchProfile();
});

function logout() {
        // Remove the user's token from local storage
        localStorage.removeItem("token");
        
        window.location.href = "/";
}


function showContent(contentId, link) {
    // Hide other content sections
    document.getElementById('contentHome').style.display = contentId === 'Home' ? 'block' : 'none';
    document.getElementById('contentProfile').style.display = contentId === 'Profile' ? 'block' : 'none';
    document.getElementById('contentTasks').style.display = contentId === 'Tasks' ? 'block' : 'none';
    document.getElementById('contentPoints').style.display = contentId === 'Points' ? 'block' : 'none';
    document.getElementById('contentAppDetail').style.display = 'none';
    // Remove "active" class from all buttons
    const buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add "active" class to the clicked button
    link.classList.add('active');

    if (contentId === 'Home') {
        fetchAppsToInstallData();
    }
    else if (contentId ==='Tasks'){
        fetchInstalledAppsData();
    }
}

function fetchAppsToInstallData() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage.");
        return;
    }

    // Set up the headers with the Authorization token
    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    // Set up the fetch request with the headers
    const requestOptions = {
        method: 'GET',
        headers: headers
    };
    
    fetch("/api/apps-to-install/", requestOptions)
        .then(response => response.json())
        .then(data => {
            const contentHomeContainer = document.getElementById('contentHome');

            contentHomeContainer.innerHTML = '';
            const appCard = document.createElement('div');
            appCard.classList.add('col-md-10', 'mb-3');
            appCard.innerHTML=`<h5>Complte these tasks and earn Reward points:<h5>`
            contentHomeContainer.appendChild(appCard);
            // Loop through the app data and create cards for each app
            data.forEach(app => {
                const appCard = document.createElement('div');
                appCard.classList.add('col-md-10', 'mb-3');

                appCard.innerHTML = `
                    <div class="card">
                        <div class="row no-gutters">
                            <div class="col-md-2">
                                <img src="${app.app_logo}" class="card-img" alt="${app.app_name} Logo">
                            </div>
                            <div class="col-md-7">
                                <div class="card-body">
                                    <h5 class="card-title">${app.app_name}</h5>
                                    <p class="card-text">Category: ${app.app_category.name},<br> Subcategory: ${app.app_subcategory.name}</p>
                                    <p class="card-text">link: ${app.app_link}</p>
                                    </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card-body text-right">
                                    <button class="btn btn-primary" onclick="showAppDetail(${app.id})">Get +${app.points} points</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                contentHomeContainer.appendChild(appCard);
            });
        })
        .catch(error => {
            console.error('Error fetching app data:', error);
        });
}

function fetchInstalledAppsData(){
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage.");
        return;
    }

    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    // Set up the fetch request with the headers
    const requestOptions = {
        method: 'GET',
        headers: headers
    };
    
    // Make the fetch request with the modified headers
    fetch("/api/apps-installed/", requestOptions)
        .then(response => response.json())
        .then(data => {
            const contentTaskContainer = document.getElementById('contentTasks');

            contentTaskContainer.innerHTML = '';
            const appCard = document.createElement('div');
            appCard.classList.add('col-md-10', 'mb-3');
            appCard.innerHTML=`<h5>You have completed these Tasks and earned rewared points:<h5>`
            contentTaskContainer.appendChild(appCard);
            // Loop through the app data and create cards for each app
            data.forEach(app => {
                const appCard = document.createElement('div');
                appCard.classList.add('col-md-10', 'mb-3');

                appCard.innerHTML = `
                    <div class="card">
                        <div class="row no-gutters">
                            <div class="col-md-2">
                                <img src="${app.app_logo}" class="card-img" alt="${app.app_name} Logo">
                            </div>
                            <div class="col-md-7">
                                <div class="card-body">
                                    <h5 class="card-title">${app.app_name}</h5>
                                    <p class="card-text">Category: ${app.app_category.name},<br> Subcategory: ${app.app_subcategory.name}</p>
                                    <p class="card-text">link: ${app.app_link}</p>
                                    </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card-body text-right">
                                    <button class="btn btn-primary" onclick="">Got ${app.points} points</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                contentTaskContainer.appendChild(appCard);
            });
        })
        .catch(error => {
            console.error('Error fetching app data:', error);
        });
}

function showAppDetail(appId) {
    // Hide other content sections
    document.getElementById('contentHome').style.display = 'none';
    document.getElementById('contentProfile').style.display = 'none';
    document.getElementById('contentTasks').style.display = 'none';
    document.getElementById('contentPoints').style.display = 'none';

    // Show the 'contentAppDetail' element
    const contentAppDetail = document.getElementById('contentAppDetail');
    contentAppDetail.style.display = 'block';

    // Fetch the app details using the appId
    fetchAppDetails(appId)
    .then(data => {
        // Populate 'contentAppDetail' with app details and the screenshot upload form
        contentAppDetail.innerHTML = `
            <div class="app-details-container">
                <div class="app-logo-container">
                    <img src="${data.app_logo}" alt="${data.app_name} Logo" class="app-logo">
                </div>
                <div class="app-info-container">
                    <h2>${data.app_name}</h2>
                    <p>Points: ${data.points}</p>
                    
                </div>
                    <a href="#" class="btn btn-primary">Install</a>
            </div>
            <hr>
            <form id="screenshotForm" enctype="multipart/form-data" class="screenshot-form">
                <label for="screenshot" class="file-drop-label" >
                    <span>Drop the screenshot of the installed app to get reward points</span>
                    <p id="selectedFileName"></p>
                    <div class="image-container text-center">
                        <img id="droppedImage" style="max-width: 20vh; display: none; margin: 0 auto;">
                    </div>
                </label>
                <input type="file" id="screenshot" name="screenshot" style="display: none;">
                <br>                    
            </form>
        `;

        // Add event listener to the screenshot form
        const screenshotForm = document.getElementById("screenshotForm");
        let fileInput = document.getElementById("screenshot");
        const fileDropLabel = document.querySelector(".file-drop-label");
        const selectedFileName = document.getElementById("selectedFileName");
        const droppedImage = document.getElementById("droppedImage");

        fileInput.addEventListener("change", () => {
            if (fileInput.files.length > 0) {
                selectedFileName.textContent = `Selected file: ${fileInput.files[0].name}`;
                // Display the selected image
                const reader = new FileReader();
                reader.onload = function (e) {
                    droppedImage.src = e.target.result;
                    droppedImage.style.display = "block";
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                selectedFileName.textContent = "";
                droppedImage.style.display = "none";
            }
        });

        fileDropLabel.addEventListener("dragover", (e) => {
            e.preventDefault();
            fileDropLabel.classList.add("dragover");
        });

        fileDropLabel.addEventListener("dragleave", () => {
            fileDropLabel.classList.remove("dragover");
        });

        fileDropLabel.addEventListener("drop", (e) => {
            e.preventDefault();
            fileDropLabel.classList.remove("dragover");

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const validFiles = Array.from(files).filter(file => {
                    const allowedExtensions = [".jpg", ".jpeg", ".png"];
                    const fileExtension = file.name.toLowerCase().slice((file.name.lastIndexOf(".") - 1 >>> 0) + 2);
        
                    return allowedExtensions.includes(`.${fileExtension}`);
                });

                if (validFiles.length > 0) {
                    const screenshotFile = validFiles[0];

                    selectedFileName.textContent = `Selected file: ${validFiles[0].name}`;
                    // Display the selected image
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        droppedImage.src = e.target.result;
                        droppedImage.style.display = "block";
                    };
                    reader.readAsDataURL(screenshotFile);
                    addTask(data.id, screenshotFile );
                } else {
                    alert("Please drop only image files with extensions .jpg, .jpeg, or .png.");
                }
            }
        });
    })
    .catch(error => {
        console.error('Error fetching app details:', error);
    });
}

function addTask(app_id, screenshotFile){
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token not found in local storage.");
        return;
    }

    if (!screenshotFile) {
        alert("Please select a screenshot before submitting.");
        return;
    }

    // Create a FormData object to send the screenshot data
    const formData = new FormData();
    formData.append("screenshot", screenshotFile);
    formData.append("app_id", app_id);

    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: formData
    };

    fetch("/api/tasks/", requestOptions)
        .then(response => {
            if (response.status === 201) {
                // Task was created successfully
                return response.json()
                    .then(data => {
                        alert("Reward Granted successfully.");
                        location.reload();
                    });
            } else if (response.status === 400) {
                // Task already exists or other client error
                return response.json()
                    .then(data => {
                        alert("You already got reward for this app");
                        location.reload();
                    });
                } else {
                    console.error('Error adding task: Unexpected response status:', response.status);
                    alert("An unexpected error occurred while adding the task.");
                }
            })
        .catch(error => {
            console.error('Error adding task:', error);
            alert("Error adding task: " + error);
        });

}

// Function to fetch app details
function fetchAppDetails(appId) {
    const token = localStorage.getItem("token");
    const headers = new Headers({
        'Authorization': `Token ${token}`
    });
    const requestOptions = {
        method: 'GET',
        headers: headers
    };

    return fetch(`/api/app-detail/${appId}/`, requestOptions)
        .then(response => response.json());
}
