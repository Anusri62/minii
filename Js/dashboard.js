
function showWelcome() {

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("loggedInUser"));
    } catch (e) {}

    if (user) {
        const firstName = user.name.split(" ")[0];
        document.getElementById("welcomeTitle").textContent =
            "Welcome, " + firstName + " 📚";
        document.getElementById("welcomeSub").textContent =
            "Here is the overview of your library today.";
    }

}

function loadDashboard() {

    showWelcome();

    // Get books from Local Storage
    const books = Store.get("books");

    // Get members from Local Storage
    const members = Store.get("members");

    // Get issued books from Local Storage
    const issued = Store.get("issues");


    // ===================================
    // TOTAL BOOKS
    // ===================================

    document.getElementById("totalBooks").textContent = books.length;


    // ===================================
    // TOTAL BOOK QUANTITY
    // ===================================

    const totalQuantity = books.reduce(function(total, book) {
        return total + Number(book.quantity || 0);
    }, 0);

    document.getElementById("totalQuantity").textContent = totalQuantity;


    // ===================================
    // TOTAL MEMBERS
    // ===================================

    document.getElementById("totalMembers").textContent = members.length;


    // ===================================
    // ISSUED BOOKS
    // ===================================

    const issuedCount = issued
        .filter(function(item) { return item.status !== "Returned"; })
        .reduce(function(total, item) {
            return total + Number(item.quantity || 1);
        }, 0);

    document.getElementById("issuedBooks").textContent = issuedCount;


    // ===================================
    // RECENT BOOKS
    // ===================================

    const recentBooksBody = document.getElementById("recentBooksBody");

    recentBooksBody.innerHTML = "";

    if (books.length === 0) {

        recentBooksBody.innerHTML = `
            <tr>
                <td colspan="5">No books added yet.</td>
            </tr>
        `;

        return;
    }

    // Latest 5 Books
    const recentBooks = [...books].reverse().slice(0, 5);

    recentBooks.forEach(function(book) {

        const row = document.createElement("tr");

        [
            book.bookId ?? book.id,
            book.bookName ?? book.name,
            book.author,
            book.category,
            book.quantity
        ].forEach(function(value) {

            const cell = document.createElement("td");

            cell.textContent = value ?? "";

            row.appendChild(cell);

        });

        recentBooksBody.appendChild(row);

    });

}




// ===================================
// LOAD DASHBOARD
// ===================================

loadDashboard();
