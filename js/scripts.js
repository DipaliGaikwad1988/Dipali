document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signup-form');
    const signInForm = document.getElementById('signin-form');
    const signOutButton = document.getElementById('signOut');

    // Check if the user is already logged in
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentPage = window.location.pathname;

    // Redirect to home page if already logged in
    if (loggedInUser && (currentPage === '/signin.html' || currentPage === '/signup.html')) {
        window.location.href = 'home.html';
    }

    // Redirect to sign-in page if user is not logged in and trying to access a protected page
    const protectedPages = ['/home.html', '/create-edit-event.html']; // Add all your protected pages here
    if (!loggedInUser && protectedPages.includes(currentPage)) {
        alert('You should sign in first');
        window.location.href = 'signin.html';
    }

    // Handle sign-up form submission
    if (signUpForm) {
        signUpForm.addEventListener('submit', event => {
            event.preventDefault();

            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                alert('User already exists!');
                return;
            }

            const newUser = { firstName, lastName, email, password, events: [] };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert('Sign-up successful!');
            window.location.href = 'signin.html';
        });
    }

    // Handle sign-in form submission
    if (signInForm) {
        signInForm.addEventListener('submit', event => {
            event.preventDefault();

            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.email === email && user.password === password);

            if (!user) {
                alert('Invalid email or password!');
                return;
            }

            localStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Sign-in successful!');
            window.location.href = 'home.html';
        });
    }

    // Handle sign-out button click
    if (signOutButton) {
        signOutButton.addEventListener('click', () => {
            // Clear user session data
            localStorage.removeItem('loggedInUser');
            // Redirect to the index page
            window.location.href = 'index.html';
        });
    }

    // Handle event creation
    const eventForm = document.getElementById('event-form');
    if (eventForm) {
        eventForm.addEventListener('submit', event => {
            event.preventDefault();

            const title = document.getElementById('event-title').value;
            const image = document.getElementById('event-image').value;

            const eventData = { title, image };

            // Get the logged-in user from local storage
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

            // Add event to the logged-in user's events
            loggedInUser.events.push(eventData);

            // Update the user data in local storage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(user => user.email === loggedInUser.email);
            users[userIndex] = loggedInUser;

            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            alert('Event created successfully!');
            window.location.href = 'home.html';
        });
    }

    // Display events on home page
    const eventsDataString = localStorage.getItem('loggedInUser');
    if (eventsDataString && currentPage === '/home.html') {
        const loggedInUser = JSON.parse(eventsDataString);

        // Display the stored event data
        const eventListContainer = document.getElementById('event-list');
        if (eventListContainer) {
            loggedInUser.events.forEach(eventData => {
                const eventCard = document.createElement('div');
                eventCard.classList.add('event-card', 'col-12', 'mb-2', 'px-5');
                eventCard.innerHTML = `
                    <h3>${eventData.title}</h3>
                    <img src="${eventData.image}" alt="${eventData.title}" style="width: 100%; height: auto;">
                `;
                eventListContainer.appendChild(eventCard);
            });
        }
    }

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('[id^=toggle-password]');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const inputId = button.id.replace('toggle-', '');
            togglePasswordVisibility(inputId);
        });
    });
});

function togglePasswordVisibility(inputId) {
    const inputElement = document.getElementById(inputId);
    const buttonElement = document.getElementById(`toggle-${inputId}`);

    if (inputElement.type === "password") {
        inputElement.type = "text";
        buttonElement.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        inputElement.type = "password";
        buttonElement.innerHTML = '<i class="fas fa-eye"></i>';
    }
}
