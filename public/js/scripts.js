// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', { //login route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });


    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user)); // Save user data
        window.location.href = data.user.role === 'admin' ? 'admin.html' : 'student.html';
    } else {
        alert(data.message);
    }
});

// Registration Form Submission
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    const response = await fetch('/api/auth/register', { //register route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
});

// Fetch and Display Books (Student Dashboard)
if (window.location.pathname.endsWith('student.html')) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('username').textContent = user.username;

    const fetchBooks = async () => {
        const response = await fetch('/api/books'); //books route
        const books = await response.json();
        const booksContainer = document.getElementById('books');
        booksContainer.innerHTML = books.map(book => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.author}</p>
                        <p class="card-text">$${book.price}</p>
                        <p class="card-text">${book.level}</p>
                        <button class="btn btn-primary" onclick="addToCart('${book._id}')">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    fetchBooks();
}

// Add Book Modal (Admin Dashboard)
const openAddBookModal = () => {
    const modal = new bootstrap.Modal(document.getElementById('addBookModal'));
    modal.show();
};

// Add Book Form Submission
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const price = document.getElementById('price').value;
    const level = document.getElementById('level').value;
    const image = document.getElementById('image').value;

    const response = await fetch('/api/books', { //books route
        method: 'POST',
        headers: {

            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, price, level, image_url }),
    });

    const data = await response.json();
    if (response.ok) {
        alert('Book added successfully');
        window.location.reload();
    } else {
        alert('Failed to add book');
    }
});

// Fetch and Display Books (Admin Dashboard)
if (window.location.pathname.endsWith('admin-books.html')) {
    const fetchBooks = async () => {
        const response = await fetch('/api/books'); //books route
        const books = await response.json();
        const booksContainer = document.getElementById('books');
        booksContainer.innerHTML = books.map(book => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${book.image}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.author}</p>
                        <p class="card-text">$${book.price}</p>

                        <p class="card-text">${book.level}</p>
                        <button class="btn btn-warning" onclick="editBook('${book._id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteBook('${book._id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    };

    fetchBooks();
}

// Edit Book
const editBook = async (bookId) => {
    const response = await fetch(`/api/books/${bookId}`); //books route
    const book = await response.json();

    // Populate the edit modal with book data
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editPrice').value = book.price;
    document.getElementById('editLevel').value = book.level;
    document.getElementById('editImageUrl').value = book.image_url;

    // Open the edit modal
    const modal = new bootstrap.Modal(document.getElementById('editBookModal'));
    modal.show();

    // Handle form submission
    document.getElementById('editBookForm').onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('editTitle').value;
        const author = document.getElementById('editAuthor').value;
        const price = document.getElementById('editPrice').value;
        const level = document.getElementById('editLevel').value;
        const image = document.getElementById('editImage').value;


        const updateResponse = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, price, level, image }),
        });


        if (updateResponse.ok) {
            alert('Book updated successfully');
            window.location.reload();
        } else {
            alert('Failed to update book');
        }
    };
};

// Delete Book
const deleteBook = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Book deleted successfully');
            window.location.reload();
        } else {
            alert('Failed to delete book');
        }
    }
};

// Fetch and Display Students (Admin Dashboard)
if (window.location.pathname.endsWith('admin-students.html')) {
    const fetchStudents = async () => {
        const response = await fetch('/api/students');
        const students = await response.json();
        const studentsContainer = document.getElementById('students');
        studentsContainer.innerHTML = students.map(student => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${student.username}</h5>
                    <p class="card-text">${student.email}</p>
                    <p class="card-text">Role: ${student.role}</p>
                    <button class="btn btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    };

    fetchStudents();
}

// Delete Student
const deleteStudent = async (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
        const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Student deleted successfully');
            window.location.reload();
        } else {
            alert('Failed to delete student');
        }
    }
};

// Add to Cart (Student Dashboard)
const addToCart = async (bookId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to add books to your cart');
        return;
    }

    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id, bookId }),
    });

    if (response.ok) {
        alert('Book added to cart');
        window.location.reload();
    } else {
        alert('Failed to add book to cart');
    }
};

// Fetch and Display Cart (Student Dashboard)
if (window.location.pathname.endsWith('student.html')) {
    const fetchCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please log in to view your cart');
            return;
        }

        const response = await fetch(`/api/cart/${user._id}`);
        const cart = await response.json();
        const cartContainer = document.getElementById('cart');
        cartContainer.innerHTML = cart.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.book.title}</h5>
                    <p class="card-text">Quantity: ${item.quantity}</p>
                    <button class="btn btn-danger" onclick="removeFromCart('${item._id}')">Remove</button>
                </div>
            </div>
        `).join('');
    };

    fetchCart();
}

// Remove from Cart
const removeFromCart = async (cartItemId) => {
    const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Item removed from cart');
        window.location.reload();
    } else {
        alert('Failed to remove item from cart');
    }
};

// Logout
const logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

// Toggle Sidebar on Mobile
const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
};

// Add Event Listener for Mobile Menu
const mobileMenuButton = document.createElement('button');
mobileMenuButton.innerHTML = '☰';
mobileMenuButton.classList.add('mobile-menu-button');
mobileMenuButton.onclick = toggleSidebar;

document.querySelector('.header').prepend(mobileMenuButton);
