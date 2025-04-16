export class AuthSystem {
    constructor(onLoginSuccess) {
        this.onLoginSuccess = onLoginSuccess;
        this.authContainer = document.getElementById('authContainer');
        this.loginForm = document.getElementById('loginForm');
        this.signupForm = document.getElementById('signupForm');
        this.showSignupBtn = document.getElementById('showSignup');
        this.showLoginBtn = document.getElementById('showLogin');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.signupForm.addEventListener('submit', this.handleSignup.bind(this));
        this.showSignupBtn.addEventListener('click', () => {
            this.loginForm.style.display = 'none';
            this.signupForm.style.display = 'flex';
        });
        this.showLoginBtn.addEventListener('click', () => {
            this.signupForm.style.display = 'none';
            this.loginForm.style.display = 'flex';
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUser').value;
        const password = document.getElementById('loginPass').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.authContainer.style.display = 'none';
                this.onLoginSuccess(username);
            } else {
                alert(data.message || 'Erreur de connexion');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Erreur de connexion au serveur');
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        const username = document.getElementById('signupUser').value;
        const password = document.getElementById('signupPass').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Compte créé avec succès! Connectez-vous maintenant.');
                this.showLoginForm();
            } else {
                alert(data.message || 'Erreur d\'inscription');
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            alert('Erreur de connexion au serveur');
        }
    }

    showLoginForm() {
        this.signupForm.style.display = 'none';
        this.loginForm.style.display = 'flex';
    }
} 