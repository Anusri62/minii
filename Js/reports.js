// ===================================
// REPORTS (per-user data)
// ===================================

const books = Store.get("books");
const members = Store.get("members");
const issues = Store.get("issues");

const issuedList = issues.filter(function (i) { return i.status !== "Returned"; });
const returnedList = issues.filter(function (i) { return i.status === "Returned"; });

// ---------- Summary cards ----------

const availableCopies = books.reduce(function (t, b) {
    return t + Number(b.quantity || 0);
}, 0);

document.getElementById("totalBooks").textContent = books.length;
document.getElementById("totalMembers").textContent = members.length;
document.getElementById("totalIssued").textContent = issuedList.length;
document.getElementById("totalReturned").textContent = returnedList.length;
document.getElementById("availableBooks").textContent = availableCopies;

// ---------- Tables ----------

function renderReport(bodyId, list, emptyText, dateOf, searchText) {

    const body = document.getElementById(bodyId);
    const term = (searchText || "").toLowerCase().trim();

    const filtered = list.filter(function (i) {
        return (i.memberName + " " + i.bookName).toLowerCase().includes(term);
    });

    body.innerHTML = "";

    if (filtered.length === 0) {
        body.innerHTML =
            '<tr><td colspan="5" class="empty-message">' + emptyText + '</td></tr>';
        return;
    }

    filtered.forEach(function (issue) {

        const row = document.createElement("tr");

        [issue.memberName, issue.bookName, issue.issueDate, dateOf(issue)]
            .forEach(function (v) {
                const cell = document.createElement("td");
                cell.textContent = v || "-";
                row.appendChild(cell);
            });

        const statusCell = document.createElement("td");
        const status = document.createElement("span");
        status.className = "status" + (issue.status === "Returned" ? " returned" : "");
        status.textContent = issue.status === "Returned" ? "Returned" : "Issued";
        statusCell.appendChild(status);
        row.appendChild(statusCell);

        body.appendChild(row);

    });

}

function drawIssued() {
    renderReport("issuedReport", issuedList, "No issued records found.",
        function (i) { return i.returnDate; },
        document.getElementById("issueSearch").value);
}

function drawReturned() {
    renderReport("returnedReport", returnedList, "No returned records found.",
        function (i) { return i.actualReturnDate || i.returnDate; },
        document.getElementById("returnSearch").value);
}

document.getElementById("issueSearch").addEventListener("input", drawIssued);
document.getElementById("returnSearch").addEventListener("input", drawReturned);

drawIssued();
drawReturned();
