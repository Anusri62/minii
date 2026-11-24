// =========================================
// BookNest - shared helpers
// 1. Same navbar on every page
// 2. Per-user data storage (new user = empty data)
// 3. Login guard
// =========================================

(function () {

    const PUBLIC_PAGES = ["login.html", "register.html", "forgot.html", "index.html", ""];

    function currentPage() {
        return location.pathname.split("/").pop();
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem("loggedInUser"));
        } catch (e) {
            return null;
        }
    }

    // ---------- Per-user storage ----------
    // Data is saved under "<key>:<email>" so every account
    // has its own books, members, issues.
    function userKey(key) {
        const user = getUser();
        return user ? key + ":" + user.email.toLowerCase() : key;
    }

    window.Store = {
        get: function (key) {
            try {
                return JSON.parse(localStorage.getItem(userKey(key))) || [];
            } catch (e) {
                return [];
            }
        },
        set: function (key, value) {
            localStorage.setItem(userKey(key), JSON.stringify(value));
        }
    };

    // ---------- Login guard ----------
    if (!PUBLIC_PAGES.includes(currentPage()) && !getUser()) {
        location.replace("login.html");
        return;
    }

    // ---------- Logout ----------
    window.logout = function () {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("isLoggedIn");
            location.href = "login.html";
        }
        return false;
    };

    // ---------- Shared navbar ----------
    const links = [
        ["dashboard.html", "Dashboard"],
        ["book.html", "Books"],
        ["member.html", "Members"],
        ["issue.html", "Issue Book"],
        ["return.html", "Return Book"],
        ["reports.html", "Reports"]
    ];

    function buildNavbar() {
        const holder = document.getElementById("navbar");
        if (!holder) return;

        const user = getUser();
        const page = currentPage();

        let html = '<header class="navbar">' +
            '<a class="logo" href="dashboard.html">📚 BookNest</a><nav>';

        if (user) {
            links.forEach(function (l) {
                html += '<a href="' + l[0] + '"' +
                    (l[0] === page ? ' class="active"' : '') + '>' + l[1] + '</a>';
            });
            html += '<span class="user-chip">👤 ' +
                user.name.replace(/</g, "&lt;") + '</span>';
            html += '<a href="#" class="logout-link" onclick="return logout()">Logout</a>';
        } else {
            html += '<a href="login.html"' + (page === "login.html" ? ' class="active"' : '') + '>Login</a>';
            html += '<a href="register.html"' + (page === "register.html" ? ' class="active"' : '') + '>Register</a>';
        }

        html += '</nav></header>';
        holder.outerHTML = html;
    }

    document.addEventListener("DOMContentLoaded", buildNavbar);

})();
