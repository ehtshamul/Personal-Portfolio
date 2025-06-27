document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorDiv = document.getElementById("login-error");
    const btnText = document.querySelector(".btn-text");
    const btnSpinner = document.querySelector(".btn-spinner");

    // Redirect if already logged in
    if (localStorage.getItem("admintoken")) {
        window.location.href = './dashboard.html';
        return;
    }

    // Login submit handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const username = formData.get('username').trim();
        const password = formData.get('password');

        // Basic validation
        if (!username || !password) {
            showError("Please fill in all fields");
            return;
        }

        const credentials = { username, password };

        // Show loading
        setLoadingState(true);
        hideError();

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store authentication data
                localStorage.setItem('admintoken', data.token);
                localStorage.setItem('adminuser', JSON.stringify(data.user));
                
                // Redirect to dashboard
                window.location.href = "/dashboard.html";
            } else {
                showError(data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error('Login error:', error);
            showError("Network error. Please check your connection and try again.");
        } finally { 
            setLoadingState(false);
        }
    });

    // Helper functions
    function setLoadingState(loading) {
        btnText.style.display = loading ? "none" : "block";
        btnSpinner.style.display = loading ? "block" : "none";
        document.getElementById('login-button').disabled = loading;
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        
        // Shake animation for error
        loginForm.style.animation = "shake 0.5s";
        setTimeout(() => {
            loginForm.style.animation = "";
        }, 500);
    }

    function hideError() {
        errorDiv.style.display = "none";
    }
    
    // Add shake animation for errors
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
        }
    `;
    document.head.appendChild(style);
});