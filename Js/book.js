
// Get books from Local Storage

let books = Store.get("books");

let editIndex = -1;


// Save Books

function saveBooks() {
    Store.set("books", books);
}


// Add Book

function addBook(event) {

    event.preventDefault();

    const bookId = document.getElementById("bookId").value.trim();
    const bookName = document.getElementById("bookName").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value;
    const publisher = document.getElementById("publisher").value.trim();
    const year = document.getElementById("year").value;
    const quantity = Number(document.getElementById("quantity").value);

    if (!bookId || !bookName || !author || !category || !publisher || !year) {
        alert("Please fill all fields!");
        return;
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        alert("Quantity must be greater than zero!");
        return;
    }

    if (!Number.isInteger(Number(year)) || Number(year) <= 0) {
        alert("Enter a valid year!");
        return;
    }

    // Duplicate ID Check

    const duplicate = books.some(function(book, index) {
        return book.bookId.toLowerCase() === bookId.toLowerCase()
            && index !== editIndex;
    });

    if (duplicate) {
        alert("Book ID already exists!");
        return;
    }

    const newBook = {
        bookId,
        bookName,
        author,
        category,
        publisher,
        year,
        quantity
    };

    // Edit Book

    if (editIndex !== -1) {

        books[editIndex] = newBook;

        alert("Book updated successfully!");

        editIndex = -1;

        document.getElementById("submitBtn").textContent = "Add Book";
        document.getElementById("formTitle").textContent = "➕ Add New Book";

    }

    // Add New Book

    else {

        books.push(newBook);

        alert("Book added successfully! 🎉");

    }

    saveBooks();

    document.getElementById("bookForm").reset();

    displayBooks();

}


// Display Books

function displayBooks(bookList = books) {

    const tableBody = document.getElementById("bookTableBody");

    const emptyMessage = document.getElementById("emptyMessage");

    tableBody.innerHTML = "";

    document.getElementById("bookCount").textContent = books.length;

    if (bookList.length === 0) {

        emptyMessage.textContent = books.length === 0
            ? "No books added yet. Please add a book."
            : "No matching books found.";

        return;
    }

    emptyMessage.textContent = "";

    bookList.forEach(function(book) {

        const index = books.indexOf(book);

        const row = document.createElement("tr");

        const values = [
            book.bookId,
            book.bookName,
            book.author,
            book.category,
            book.quantity
        ];

        values.forEach(function(value) {

            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);

        });

        // Action Buttons

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.onclick = function() {
            editBook(index);
        };

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.onclick = function() {
            deleteBook(index);
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);

    });

}


// Edit Book

function editBook(index) {

    const book = books[index];

    document.getElementById("bookId").value = book.bookId;
    document.getElementById("bookName").value = book.bookName;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;
    document.getElementById("publisher").value = book.publisher;
    document.getElementById("year").value = book.year;
    document.getElementById("quantity").value = book.quantity;

    editIndex = index;

    document.getElementById("submitBtn").textContent = "Save Changes";
    document.getElementById("formTitle").textContent = "✏️ Edit Book";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete Book

function deleteBook(index) {

    if (confirm("Are you sure you want to delete this book?")) {

        books.splice(index, 1);

        saveBooks();

        alert("Book deleted successfully!");

        if (editIndex === index) {
            cancelEdit();
        } else if (editIndex > index) {
            editIndex--;
        }

        displayBooks();

    }

}


// Search Books

function searchBooks() {

    const searchValue = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const filteredBooks = books.filter(function(book) {

        return (
            book.bookName.toLowerCase().includes(searchValue) ||
            book.author.toLowerCase().includes(searchValue) ||
            book.category.toLowerCase().includes(searchValue)
        );

    });

    displayBooks(filteredBooks);

}


// Clear Form

function cancelEdit() {

    editIndex = -1;

    document.getElementById("bookForm").reset();

    document.getElementById("submitBtn").textContent = "Add Book";

    document.getElementById("formTitle").textContent = "➕ Add New Book";

}




// Initial Display

displayBooks();
