let tempUsername = "";

// Resolve dynamic state when loading the page
document.addEventListener("DOMContentLoaded", () => {
    // 🌙 Load Dark Mode Preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        updateThemeToggleIcon(true);
    } else {
        updateThemeToggleIcon(false);
    }
    
    // Add event listeners to active navbar links based on location
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(".nav-menu a.nav-link");
    links.forEach(link => {
        const href = link.getAttribute("href");
        if (currentPath.includes(href) && href !== "/") {
            link.classList.add("active");
        } else if (currentPath === "/" && href === "/") {
            link.classList.add("active");
        }
    });
});

// Theme Toggle Action
function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateThemeToggleIcon(isDark);
}

function updateThemeToggleIcon(isDark) {
    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
        btn.innerHTML = isDark ? "☀️" : "🌙";
        btn.setAttribute("title", isDark ? "Açık Tema" : "Karanlık Tema");
    }
}

// Open Login Modal with corresponding role title
function openLoginModal(roleName) {
    const roleTitles = {
        manager: "🏢 Kurumsal Giriş",
        teacher: "👨‍🏫 Öğretmen Girişi",
        student: "👨‍🎓 Öğrenci Girişi",
        parent: "👪 Veli Girişi"
    };
    
    document.getElementById("loginTitle").innerText = roleTitles[roleName] || "Sistem Girişi";
    document.getElementById("loginModal").style.display = "flex";
    document.getElementById("username").focus();
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
    cancelVerify();
}

// 2FA login flows
async function doLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorEl = document.getElementById("error");
    const loginBtn = document.getElementById("loginBtn");

    errorEl.innerText = "";
    errorEl.style.display = "none";
    loginBtn.disabled = true;
    loginBtn.innerText = "Bağlanıyor...";

    try {
        const res = await fetch((window.API_BASE || "") + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.innerText = data.error || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.";
            errorEl.style.display = "block";
            loginBtn.disabled = false;
            loginBtn.innerText = "Giriş Yap";
            return;
        }

        if (data.status === "two_factor_required") {
            tempUsername = data.username;
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("verifyForm").style.display = "block";
            document.getElementById("loginDesc").innerText = "Lütfen telefonunuza gönderilen kodu girin.";
            document.getElementById("phoneLabel").innerText = `${data.phone} numaralı WhatsApp hattına gönderilen kod:`;
            
            // Show virtual toast
            const toast = document.getElementById("waToast");
            const toastText = document.getElementById("waToastText");
            toastText.innerHTML = `Giriş kodunuz: <strong style='font-size:1.1rem; color:#25d366;'>${data.mock_code_for_testing}</strong>`;
            toast.classList.add("show");
            
            setTimeout(() => {
                toast.classList.remove("show");
            }, 6000);

            document.getElementById("verifyCode").focus();
        }

    } catch (err) {
        errorEl.innerText = "Sunucu bağlantı hatası! (Backend çalışıyor mu?)";
        errorEl.style.display = "block";
        console.error("Login Error:", err);
        loginBtn.disabled = false;
        loginBtn.innerText = "Giriş Yap";
    }
}

async function doVerify(event) {
    event.preventDefault();

    const code = document.getElementById("verifyCode").value;
    const errorEl = document.getElementById("error");
    const verifyBtn = document.getElementById("verifyBtn");

    errorEl.innerText = "";
    errorEl.style.display = "none";
    verifyBtn.disabled = true;
    verifyBtn.innerText = "Doğrulanıyor...";

    try {
        const res = await fetch((window.API_BASE || "") + "/api/login/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: tempUsername, code: code })
        });

        const data = await res.json();

        if (!res.ok) {
            errorEl.innerText = data.error || "Kod doğrulanamadı.";
            errorEl.style.display = "block";
            verifyBtn.disabled = false;
            verifyBtn.innerText = "Kodu Doğrula";
            return;
        }

        // Save JWT & user details
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.role);

        // Dynamic Route Redirect
        let redirectPath = "";
        switch (data.role) {
            case "manager":    redirectPath = "/html/manager/dashboard.html"; break;
            case "clerk":      redirectPath = "/html/clerk/dashboard.html"; break;
            case "accounting": redirectPath = "/html/accounting/dashboard.html"; break;
            case "teacher":    redirectPath = "/html/teacher/dashboard.html"; break;
            case "student":    redirectPath = "/html/student/dashboard.html"; break;
            case "parent":     redirectPath = "/html/parent/dashboard.html"; break;
            default:
                errorEl.innerText = "Tanımsız rol yetkisi!";
                errorEl.style.display = "block";
                verifyBtn.disabled = false;
                verifyBtn.innerText = "Kodu Doğrula";
                return;
        }
        
        window.location.href = redirectPath;

    } catch (err) {
        errorEl.innerText = "Bağlantı hatası!";
        errorEl.style.display = "block";
        verifyBtn.disabled = false;
        verifyBtn.innerText = "Kodu Doğrula";
    }
}

function cancelVerify() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("verifyForm").style.display = "none";
    document.getElementById("loginDesc").innerText = "Kurumsal dershane yönetim paneli";
    document.getElementById("error").style.display = "none";
    document.getElementById("waToast").classList.remove("show");
    
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.disabled = false;
    loginBtn.innerText = "Giriş Yap";
}
