// ===================================
// RETURN BOOK MANAGEMENT (per-user data)
// ===================================

function loadIssuedBooks() {

    const select = document.getElementById("issueSelect");
    const issues = Store.get("issues");

    select.innerHTML = '<option value="">Select Issued Book</option>';

    issues.forEach(function (issue, index) {

        if (issue.status === "Returned") return;

        const option = document.createElement("option");

        option.value = index;
        option.textContent =
            issue.bookName + " — " + issue.memberName +
            " (Due: " + issue.returnDate + ")";

        select.appendChild(option);

    });

}

function displayReturned() {

    const table = document.getElementById("returnTable");
    const returned = Store.get("issues").filter(function (i) {
        return i.status === "Returned";
    });

    table.innerHTML = "";

    if (returned.length === 0) {
        table.innerHTML =
            '<tr><td colspan="5" class="empty-message">No books returned yet</td></tr>';
        return;
    }

    returned.forEach(function (issue) {

        const row = document.createElement("tr");

        [issue.memberName, issue.bookName, issue.issueDate,
         issue.actualReturnDate || issue.returnDate].forEach(function (v) {
            const cell = document.createElement("td");
            cell.textContent = v || "-";
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "status returned";
        status.textContent = "Returned";
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        table.appendChild(row);

    });

}

document.getElementById("returnForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const index = document.getElementById("issueSelect").value;
    const returnDate = document.getElementById("returnDate").value;

    const issues = Store.get("issues");
    const issue = issues[index];

    if (index === "" || !issue) {
        alert("Please select an issued book!");
        return;
    }

    if (!returnDate) {
        alert("Please select the return date!");
        return;
    }

    if (returnDate < issue.issueDate) {
        alert("Return date cannot be before the issue date!");
        return;
    }

    issue.status = "Returned";
    issue.actualReturnDate = returnDate;

    // Give the copy back to the library stock
    const books = Store.get("books");
    const book = books.find(function (b) {
        return String(b.bookId ?? b.id) === String(issue.bookId);
    });

    if (book) {
        book.quantity = Number(book.quantity) + 1;
        Store.set("books", books);
    }

    Store.set("issues", issues);

    alert("Book returned successfully!");

    resetReturnForm();
    loadIssuedBooks();
    displayReturned();

});

function resetReturnForm() {
    document.getElementById("returnForm").reset();
}

loadIssuedBooks();
displayReturned();
