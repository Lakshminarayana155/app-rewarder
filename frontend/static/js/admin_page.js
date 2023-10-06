
// Making the home active onload
window.onload = function() {
        showContent('Home', document.querySelector('.active'));
    };
    
// Fetch data from the API endpoint
fetch("/api/app-category/")
    .then(response => response.json())
    .then(data => {
        const appCategorySelect = document.getElementById('appCategory');

        const option = document.createElement('option');
        option.value = '';
        option.textContent = "select category";
        appCategorySelect.appendChild(option);
        // Loop through the data and create <option> elements
        data.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;

            // Append the option to the <select> element
            appCategorySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


function showContent(contentId, button) {
    // Hide other content sections
    document.getElementById('appData').style.display = contentId === 'Home' ? 'block' : 'none';
    document.getElementById('contentAddApp').style.display = contentId === 'AddApp' ? 'block' : 'none';

    // Remove "active" class from all buttons
    const buttons = document.querySelectorAll('.list-group-item');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add "active" class to the clicked button
    button.classList.add('active');
    if (contentId === 'Home') {
        fetchAppData();
    }
    
}

// Fetching the Apps from the API
function fetchAppData() {
    // Get the user's token from local storage
    const token = localStorage.getItem("a_token");

    // Check if the token is present
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
    
    // Make the fetch request with the modified headers
    fetch("/api/apps-list/", requestOptions)
        .then(response => response.json())
        .then(data => {
            const appDataContainer = document.getElementById('appData');

            // Clear any existing app data
            appDataContainer.innerHTML = '';

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
                                <div class="card-body text-right d-flex justify-content-center">
                                    <button class="btn btn-primary" onclick="deleteApp(${app.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                appDataContainer.appendChild(appCard);
            });
        })
        .catch(error => {
            console.error('Error fetching app data:', error);
        });
}

// Delete app Through API
function deleteApp(id){
    const token = localStorage.getItem("a_token");
    if (!token) {
    console.error("Token not found in local storage.");
    return;
    }

    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    const requestOptions = {
        method: 'DELETE',
        headers: headers
    };

    fetch(`/api/delete-app/${id}/`, requestOptions)
        .then(response => {
            if (response.status === 204) {
                // App deleted successfully, show an alert
                alert('App deleted successfully');
                // Refresh the page to reflect the updated data
                location.reload();
            } else if (response.status === 404) {
            // App not found, show an alert
            alert('App not found');
        } else {
            // Handle other error cases, show an alert with the error message
            alert(`Error deleting app: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error('Error deleting app:', error);
    });
}

// Add app through API's
function showAddAppForm() {
    // Hide other content sections
    document.getElementById('appData').style.display = 'none';
    document.getElementById('contentLogout').style.display = 'none';

    // Show the Add App form
    document.getElementById('contentAddApp').style.display = 'block';

    // Update the page title
    document.getElementById('pageTitle').innerText = 'Add App';

}


function logout() {
    // Remove the user's token from local storage
    localStorage.removeItem("a_token");
    
    // Redirect to the home page
    window.location.href = "/";
}

// Add apps through API's
function submitAppForm() {
    const token = localStorage.getItem("a_token");

    if (!token) {
        console.error("Token not found in local storage.");
        return;
    }

    const headers = new Headers({
        'Authorization': `Token ${token}`
    });

    const form = document.getElementById('addAppForm');
    const formData = new FormData(form);

    fetch("/api/add-app/", {
        method: 'POST',
        headers: headers,  
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        form.reset();
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}


// Populate the Subcategories in Form using API
function populateSubcategories(categoryId) {
    fetch(`/api/app-sub-category/${categoryId}/`)
        .then(response => response.json())
        .then(data => {
            // Get the <select> element for subcategory by its ID
            const appSubcategorySelect = document.getElementById('appSubcategory');

            // Clear existing options
            appSubcategorySelect.innerHTML = '';

            // Create a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Subcategory';
            appSubcategorySelect.appendChild(defaultOption);

            // Loop through the data and create <option> elements
            data.forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory.id;
                option.textContent = subcategory.name;

                // Append the option to the <select> element
                appSubcategorySelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching subcategories:', error);
        });
}

// Attach an event listener to the category dropdown
const appCategorySelect = document.getElementById('appCategory');
appCategorySelect.addEventListener('change', event => {
    const selectedCategoryId = event.target.value;

    // Populate the Subcategory dropdown based on the selected category
    populateSubcategories(selectedCategoryId);
});


