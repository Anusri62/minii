
// ===================================
// MEMBER MANAGEMENT MODULE
// ===================================

// Get members from Local Storage
let members = Store.get("members");

let editIndex = -1;


// ===================================
// ADD AND UPDATE MEMBER
// ===================================

document.getElementById("memberForm").addEventListener("submit", function(event) {

    event.preventDefault();

    // Get Form Values
    const member = {
        id: document.getElementById("memberId").value.trim(),
        name: document.getElementById("memberName").value.trim(),
        department: document.getElementById("department").value.trim(),
        email: document.getElementById("memberEmail").value.trim(),
        mobile: document.getElementById("mobile").value.trim()
    };

    // Check Empty Fields
    if (
        !member.id ||
        !member.name ||
        !member.department ||
        !member.email ||
        !member.mobile
    ) {
        alert("Please fill all fields!");
        return;
    }

    // Mobile Validation
    if (!/^[0-9]{10}$/.test(member.mobile)) {
        alert("Please enter a valid 10-digit mobile number!");
        return;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        alert("Please enter a valid email address!");
        return;
    }

    // Duplicate Member ID Validation
    const duplicate = members.some((m, index) =>
        String(m.id).toLowerCase() === member.id.toLowerCase() &&
        index !== editIndex
    );

    if (duplicate) {
        alert("Member ID already exists!");
        return;
    }

    // Add Member
    if (editIndex === -1) {
        members.push(member);
        alert("Member added successfully!");
    }

    // Update Member
    else {
        members[editIndex] = member;
        alert("Member updated successfully!");
    }

    // Save and Display
    saveMembers();
    displayMembers();
    resetForm();

});


// ===================================
// SAVE MEMBERS IN LOCAL STORAGE
// ===================================

function saveMembers() {

    Store.set("members", members);

}


// ===================================
// DISPLAY MEMBERS IN TABLE
// ===================================

function displayMembers(memberList = members) {

    const table = document.getElementById("memberTable");

    table.innerHTML = "";

    // Check Empty List
    if (memberList.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No members found
                </td>
            </tr>
        `;

        return;
    }

    // Display Each Member
    memberList.forEach(member => {

        const index = members.indexOf(member);

        const row = document.createElement("tr");

        // Member Details
        const values = [
            member.id,
            member.name,
            member.department,
            member.email,
            member.mobile
        ];

        values.forEach(value => {

            const cell = document.createElement("td");

            cell.textContent = value;

            row.appendChild(cell);

        });

        // Action Column
        const actionCell = document.createElement("td");

        // Edit Button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.className = "edit-btn";

        editButton.onclick = function() {
            editMember(index);
        };

        // Delete Button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-btn";

        deleteButton.onclick = function() {
            deleteMember(index);
        };

        actionCell.append(editButton, deleteButton);

        row.appendChild(actionCell);

        table.appendChild(row);

    });

}


// ===================================
// EDIT MEMBER
// ===================================

function editMember(index) {

    const member = members[index];

    document.getElementById("memberId").value = member.id;

    document.getElementById("memberName").value = member.name;

    document.getElementById("department").value = member.department;

    document.getElementById("memberEmail").value = member.email;

    document.getElementById("mobile").value = member.mobile;

    editIndex = index;

    document.getElementById("submitBtn").textContent = "Update Member";

    // Scroll to Form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ===================================
// DELETE MEMBER
// ===================================

function deleteMember(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this member?"
    );

    if (confirmDelete) {

        members.splice(index, 1);

        // Reset edit form if deleted member is being edited
        if (editIndex === index) {

            resetForm();

        } else if (editIndex > index) {

            editIndex--;

        }

        saveMembers();

        displayMembers();

        alert("Member deleted successfully!");

    }

}


// ===================================
// SEARCH MEMBER
// Search by ID, Name and Department
// ===================================

document.getElementById("searchMember").addEventListener("input", function() {

    const searchValue = this.value.toLowerCase().trim();

    const filteredMembers = members.filter(member =>

        String(member.id).toLowerCase().includes(searchValue) ||

        String(member.name).toLowerCase().includes(searchValue) ||

        String(member.department).toLowerCase().includes(searchValue)

    );

    displayMembers(filteredMembers);

});


// ===================================
// RESET FORM
// ===================================

function resetForm() {

    document.getElementById("memberForm").reset();

    editIndex = -1;

    document.getElementById("submitBtn").textContent = "Add Member";

}


// ===================================
// INITIAL DISPLAY
// ===================================

displayMembers();


