
// ===================================
// ISSUE BOOK MANAGEMENT
// ===================================

// Get Data from Local Storage
let members = Store.get("members");
let books = Store.get("books");
let issues = Store.get("issues");


// ===================================
// BOOK DETAILS
// ===================================

function getBookId(book) {
    return book.bookId ?? book.id;
}

function getBookName(book) {
    return book.bookName ?? book.name;
}


// ===================================
// MEMBER DETAILS
// ===================================

function getMemberId(member) {
    return member.memberId ?? member.id;
}

function getMemberName(member) {
    return member.memberName ?? member.name;
}


// ===================================
// LOAD MEMBERS
// ===================================

function loadMembers() {

    const memberSelect = document.getElementById("memberSelect");

    members = Store.get("members");

    memberSelect.innerHTML =
        '<option value="">Choose a member</option>';

    if (members.length === 0) {

        document.getElementById("memberHelp").textContent =
            "No members found. Add a member first.";

        return;
    }

    document.getElementById("memberHelp").textContent =
        "Select a registered member.";

    members.forEach(member => {

        const option = document.createElement("option");

        option.value = getMemberId(member);
        option.textContent = getMemberName(member);

        memberSelect.appendChild(option);

    });

}


// ===================================
// LOAD AVAILABLE BOOKS
// ===================================

function loadBooks() {

    const bookSelect = document.getElementById("bookSelect");

    books = Store.get("books");

    bookSelect.innerHTML =
        '<option value="">Choose a book</option>';

    const availableBooks = books.filter(book =>
        Number(book.quantity) > 0
    );

    if (availableBooks.length === 0) {

        document.getElementById("bookHelp").textContent =
            "No books are currently available.";

        return;
    }

    document.getElementById("bookHelp").textContent =
        "Select an available book.";

    availableBooks.forEach(book => {

        const option = document.createElement("option");

        option.value = getBookId(book);

        option.textContent =
            getBookName(book) +
            " (Available: " + book.quantity + ")";

        bookSelect.appendChild(option);

    });

}


// ===================================
// ISSUE BOOK FORM
// ===================================

document.getElementById("issueForm").addEventListener("submit", function(event) {

    event.preventDefault();

    // Get latest data
    members = Store.get("members");
    books = Store.get("books");
    issues = Store.get("issues");

    // Get selected values
    const memberId = document.getElementById("memberSelect").value;
    const bookId = document.getElementById("bookSelect").value;

    const issueDate = document.getElementById("issueDate").value;
    const returnDate = document.getElementById("returnDate").value;


    // Validate Member
    const selectedMember = members.find(member =>
        String(getMemberId(member)) === memberId
    );

    if (!selectedMember) {
        alert("Please select a valid member!");
        return;
    }


    // Validate Book
    const selectedBook = books.find(book =>
        String(getBookId(book)) === bookId
    );

    if (!selectedBook) {
        alert("Please select a valid book!");
        loadBooks();
        return;
    }


    // Check Availability
    if (Number(selectedBook.quantity) <= 0) {
        alert("Sorry! This book is not available.");
        loadBooks();
        return;
    }


    // Validate Dates
    if (!issueDate || !returnDate) {
        alert("Please select Issue Date and Due Date!");
        return;
    }

    if (returnDate < issueDate) {
        alert("Due Date cannot be before Issue Date!");
        return;
    }


    // Create Issue Record
    const issueRecord = {

        memberId: getMemberId(selectedMember),
        memberName: getMemberName(selectedMember),

        bookId: getBookId(selectedBook),
        bookName: getBookName(selectedBook),

        issueDate: issueDate,
        returnDate: returnDate,

        quantity: 1,
        status: "Issued"

    };


    // Decrease Book Quantity
    selectedBook.quantity = Number(selectedBook.quantity) - 1;


    // Save Updated Books
    Store.set("books", books);


    // Save Issue Record
    issues.push(issueRecord);

    Store.set("issues", issues);


    // Success Message
    alert("Book issued successfully!");


    // Reset and Refresh
    resetIssueForm();

    loadMembers();

    loadBooks();

    displayIssues();

});


// ===================================
// DISPLAY ISSUE RECORDS
// ===================================

function displayIssues() {

    const table = document.getElementById("issueTable");

    const recordCount = document.getElementById("recordCount");

    issues = Store.get("issues");

    table.innerHTML = "";

    recordCount.textContent =
        issues.length + (issues.length === 1 ? " record" : " records");

    if (issues.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No issue records found.
                </td>
            </tr>
        `;

        return;
    }

    issues.forEach(issue => {

        const row = document.createElement("tr");

        const values = [
            issue.memberName,
            issue.bookName,
            issue.issueDate,
            issue.returnDate
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value || "-";

            row.appendChild(cell);

        });

        // Status
        const statusCell = document.createElement("td");

        const status = document.createElement("span");

        status.className = "status" + (issue.status === "Returned" ? " returned" : "");

        status.textContent = issue.status || "Issued";

        statusCell.appendChild(status);

        row.appendChild(statusCell);

        table.appendChild(row);

    });

}


// ===================================
// RESET FORM
// ===================================

function resetIssueForm() {

    document.getElementById("issueForm").reset();

}




// ===================================
// INITIAL DISPLAY
// ===================================

loadMembers();

loadBooks();

displayIssues();
