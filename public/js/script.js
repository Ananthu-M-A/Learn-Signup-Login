// CREATE EJS FILE
    const btnCancel = document.getElementById('btn_cancel');
    btnCancel.addEventListener('click', () => {
        window.location.href = "/admin";
    });

// SEARCH EJS FILE
    document.addEventListener('DOMContentLoaded', function () {
    const btnSearch = document.getElementById('btn_search');
    const searchInput = document.getElementById('searchInput');

    btnSearch.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const query = searchInput.value.trim();
        if (query !== '') {
            window.location.href = "/admin/search/" + encodeURIComponent(query);
        }
        else {
            window.location.href = "/admin";
        }
    });
});

// UPDATE & DELETE EJS FILE
async function deleteUser(button) {
    const username = button.dataset.username;
    if (confirm(`Are you sure you want to delete ${username}?`)) {
        try {
            const response = await fetch(`/deleteUser/${username}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // The request was successful
                const rowToRemove = button.closest('tr');
                if (rowToRemove) {
                    rowToRemove.remove();
                } else {
                    alert('User deleted, but failed to update UI.');
                }
            } else {
                // The request was not successful
                const errorMessage = await response.text();
                alert(`Failed to delete user: ${errorMessage}`);
            }
        } catch (error) {
            // An error occurred while making the request
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    }
}

async function editUser(name, email, id) {
    let editFirstName = document.getElementById(name).value;
    let editEmail = document.getElementById(email).value;
    const editData = {
        id: id,
        firstname: editFirstName,
        email: editEmail,
    };

    if (confirm(`Are you sure you want to update?`)) {
        try {
            const response = await fetch(`/editUser`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                // Successful response
                window.location.reload();
            } else {
                // Handle non-successful response
                alert('An error occurred while updating the user.');
            }
        } catch (error) {
            // An error occurred while making the request
            console.error('Error updating user:', error);
            alert('An error occurred while updating the user.');
        }
    }
}


async function toggleAdmin(id) {
const checkbox = document.getElementById('flexSwitchCheckChecked');
 // Toggle the admin value

if (confirm(`Are you sure you want to make changes in power of the user?`)) {
  const editData = {
    id: id,
  };

  try {
    const response = await fetch(`/toggleAdmin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
  } catch (error) {
    // An error occurred while making the request
    console.error('Error updating user:', error);
    alert('An error occurred while updating the user.');
  }
}
}

// ADMIN HOME EJS FILE
const btnCreate = document.getElementById('btn_create');
const btnUpdateDelete = document.getElementById('btn_update_delete');
const btnAdminHome = document.getElementById('btn_admin_home');
const createSection = document.getElementById('createSection');
const updateDeleteSection = document.getElementById('updateDeleteSection');
const defaultTableSection = document.getElementById('defaultTableSection');

btnCreate.addEventListener('click', () => {
    createSection.style.display = 'block';
    updateDeleteSection.style.display = 'none';
    defaultTableSection.style.display = 'none';
});

btnUpdateDelete.addEventListener('click', () => {
    createSection.style.display = 'none';
    updateDeleteSection.style.display = 'block';
    defaultTableSection.style.display = 'none'; 
});

btnAdminHome.addEventListener('click', () => {
    window.location.href = "/admin";
});