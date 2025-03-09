//let userId;
// Login Form Submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8030/students/login', { //login route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    //userId =data.id;
    console.log(data);

    if (response.ok) {
        localStorage.setItem('userId', JSON.stringify(data.id)); // Save user data
        localStorage.setItem('user', JSON.stringify(data.role)); // Save user data
        localStorage.setItem('username', data.userName); // Store username
        window.location.href = data.role.toLowerCase() === 'admin' ? 'admin.html' : 'student.html';
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


    const response = await fetch('http://localhost:8030/students/add', { //register route
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('username', data.userName); // Store username
        alert(data.message);
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
});

// Display the logged-in user's username
const displayUsername = () => {
    const username = localStorage.getItem('username');
    console.log(username)
    if (username) {
        const displayElements = document.querySelectorAll('#displayUsername');
        displayElements.forEach(element => {
            element.textContent = username;
        });
    
    } else {
        // Redirect to login if no username is found
       // window.location.href = 'login.html';
    }
};

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayUsername();
});

// Fetch and Display Books (Student Dashboard)
if (window.location.pathname.endsWith('student.html')) {
    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8030/book/allBooks'); // Fetch all books
            const books = await response.json();

            console.log("Books API Response:", books); // Log the response to check the structure

            // Check if books is an array
            if (!Array.isArray(books.profile)) {
                console.error("Expected an array but got:", books.profile);
                return; // Stop execution if it's not an array
            }

            const booksContainer = document.getElementById('books');

            books.profile.forEach((book) => {
                const imageUrl = `http://localhost:8030/book/images/${book.bookId}`;

                const html = `
                    <div class="col-md-4 mb-4">
                        <div class="card" style="width: 18rem;">
                            <img src="${imageUrl}" class="card-img-top" alt="${book.title}">
                            <div class="card-body">
                                <div class="card-text"><h5 class="card-title">${book.title}</h5></div>
                                
                                <p class="card-text">${book.author}</p>
                                <p class="card-text">₦${book.price}</p>
                                <p class="card-text">Quantity: ${book.quantity}</p>
                                <p class="card-text">${book.level} LVL</p>
                                <button class="btn btn-primary" onclick="addToCart('${book.bookId}')">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                `;

                booksContainer.insertAdjacentHTML('beforeend', html);
            });
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    fetchBooks();

}

// Logout Functionality
const logout = () => {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
};

// Add logout event listener to all logout links
document.querySelectorAll('index.html').forEach(link => {
    link.addEventListener('click', logout);
});

// Add Book Modal (Admin Dashboard)
function openAddBookModal() {
    // Using Bootstrap 5 modal method
    var myModal = new bootstrap.Modal(document.getElementById('addBookModal'));
    myModal.show();
}

// Add Book Form Submission
document.getElementById('addBookForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const price = document.getElementById('price').value;
    const level = document.getElementById('level').value;
    const quantity = document.getElementById('quantity').value;
    const availability = document.getElementById('availability').value; // Fixed ID
    const fileInput = document.getElementById('image');
    const attachments = fileInput.files[0]; // Correct way to get a file
    console.log(attachments);


    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('price', price);
    formData.append('level', level);
    formData.append('quantity', quantity);
    formData.append('availability', availability);
    if (attachments) {
        formData.append('attachments', attachments); // Append file only if selected
    }

    try {
        const response = await fetch('http://localhost:8030/book/add', {
            method: 'POST',
            body: formData, // Send FormData instead of JSON
        });

        const data = await response.json();
        console.log(data);

        if (response.ok) {
            alert('Book added successfully');
            window.location.reload();
        } else {
            alert('Failed to add book');
        }
    } catch (error) {
        console.error('Error adding book:', error);
        alert('An error occurred while adding the book.');
    }
});

// Fetch and Display Books (Admin Dashboard)
if (window.location.pathname.endsWith('admin-books.html')) {
    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8030/book/allBooks'); // Fetch all books
            const books = await response.json();

            console.log("Books API Response:", books); // Log the response to check the structure

            // Check if books is an array
            if (!Array.isArray(books.profile)) {
                console.error("Expected an array but got:", books.profile);
                return; // Stop execution if it's not an array
            }

            const booksContainer = document.getElementById('books');

            books.profile.forEach((book) => {
                const imageUrl = `http://localhost:8030/book/images/${book.bookId}`;

                const html = `
                    <div class="col-md-4 mb-4">
                        <div class="card" style="width: 18rem;">
                            <img src="${imageUrl}" class="card-img-top" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.author}</p>
                                <p class="card-text">₦${book.price}</p>
                                <p class="card-text">Quantity: ${book.quantity}</p>
                                <p class="card-text">${book.level} LVL</p>
                                <button class="btn btn-warning" onclick="editBook('${book.bookId}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteBook('${book.bookId}')">Delete</button>
                            </div>
                        </div>
                    </div>
                `;

                booksContainer.insertAdjacentHTML('beforeend', html);
            });
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    fetchBooks();

}

// Edit Book
const editBook = async (bookId) => {
    try {
        // Fetch the book details
        const response = await fetch(`http://localhost:8030/book/find/${bookId}`);
        const book = await response.json();

        // Ensure modal element exists
        const modalElement = document.getElementById('editBookModal');
        if (!modalElement) {
            console.error("Modal with ID 'editBookModal' not found.");
            return;
        }

        // Open the edit modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Populate the edit modal with book data
        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editPrice').value = book.price;
        document.getElementById('editQuantity').value = book.quantity;
        document.getElementById('editLevel').value = book.level;
        document.getElementById('editAvailability').value = book.availability;

        // Handle existing image display (assuming there's an img tag)
        const imagePreview = document.getElementById('editImagePreview');
        if (imagePreview) {
             const imageUrl = `http://localhost:8030/book/images/${bookId}`
            imagePreview.src = `${imageUrl}`;
            imagePreview.style.display = 'block';
        }

        // Handle form submission for editing the book
        const form = document.getElementById('editBookForm');

        // Remove previous event listeners to prevent multiple bindings
        form.onsubmit = null;

        form.onsubmit = async (e) => {
            e.preventDefault();

            // Get updated values
            const title = document.getElementById('editTitle').value;
            const author = document.getElementById('editAuthor').value;
            const price = document.getElementById('editPrice').value;
            const quantity = document.getElementById('editQuantity').value;
            const level = document.getElementById('editLevel').value;
            const availability = document.getElementById('editAvailability').value;
            const fileInput = document.getElementById('editImageUrl');
            const attachments = fileInput.files[0]; // Get the file object

            // Create FormData object
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('price', price);
            formData.append('quantity', quantity);
            formData.append('level', level);
            formData.append('availability', availability);
            if (attachments) {
                formData.append('image', attachments); // Append file only if selected
            }
            console.log(formData)
            // Send the updated book data to the backend
            const updateResponse = await fetch(`http://localhost:8030/book/update/${bookId}`, {
                method: 'PUT',
                body: formData, // Send FormData instead of JSON
            });
            
            if (updateResponse.ok) {
                alert('Book updated successfully');
                modal.hide();  // Close modal after update
                window.location.reload();
            } else {
                alert('Failed to update book');
            }
        };
    } catch (error) {
        console.error("Error fetching book data:", error);
    }
};



// Delete Book
const deleteBook = async (bookId) => {
    if (confirm('Are you sure you want to delete this book?')) {
        const response = await fetch(`http://localhost:8030/book/deleted/${bookId}`, {
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
        try {
            const response = await fetch('http://localhost:8030/students/allStudents');
            const students = await response.json();
            console.log(students.profile);

            const tableBody = document.querySelector('#usersTable tbody');
            tableBody.innerHTML = '';

            students.profile.forEach(student => {
                const html = `
                    <tr>
                        <td>${student.userId}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(student.userName)}&background=random" 
                                     class="rounded-circle me-2" 
                                     style="width: 32px; height: 32px;">
                                ${student.userName}
                            </div>
                        </td>
                        <td>${student.email}</td>
                        <td>
                            <span class="badge bg-success status-badge">Active</span>
                        </td>
                        <td class="action-buttons">
                            <button class="btn btn-sm btn-info" onclick="viewUser('${student.userId}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-warning" onclick="editUser('${student.userId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.userId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', html);
            });

            // Update statistics
            document.getElementById('totalUsers').textContent = students.profile.length;
            document.getElementById('activeUsers').textContent = Math.floor(Math.random() * students.profile.length); // Replace with actual active users count
            document.getElementById('newUsers').textContent = Math.floor(students.profile.length * 0.3); // Replace with actual new users count

            // Reinitialize DataTable
            $('#usersTable').DataTable().destroy();
            $('#usersTable').DataTable({
                pageLength: 10,
                order: [[1, 'asc']],
                responsive: true
            });

        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    fetchStudents();
}

// Delete Student
// const deleteStud = document.querySelector('.delStud')
// delStud?.addEventListener
const deleteStudent = async (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
        const response = await fetch(`http://localhost:8030/admin/deleteUser/${studentId}`, {
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
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!user) {
        alert('Please log in to add books to your cart');
        return;
    }
    
    
    const response = await fetch('http://localhost:8030/cart/addCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({bookId, userId }),
    });

    if (response.ok) {
        alert('Book added to cart');
        window.location.reload();
    } else {
        alert('Failed to add book to cart');
    }
};

// Fetch and Display Cart (Student Dashboard)

if (window.location.pathname.endsWith('cart.html')) {
    const fetchCart = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = JSON.parse(localStorage.getItem('userId'));
        
        if (!user) {
            alert('Please log in to view your cart');
            return;
        }

        const response = await fetch(`http://localhost:8030/cart/getCartDetails/${userId}`);
        const cart = await response.json();
        console.log(cart);
        
        const cartContainer = document.getElementById('cart');
        let total = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h5 class="text-muted">Your cart is empty</h5>
                    <a href="student.html" class="btn btn-primary mt-3">Continue Shopping</a>
                </div>
            `;
        } else {
            cartContainer.innerHTML = cart.map(item => {
                const itemTotal = item.book.price * item.quantity;
                total += itemTotal;
                return `
                
                    <div class="col-12 mb-3">
                        <div class="card border-0">
                            <div class="row g-0">
                                <div class="col-md-2">
                                    <img src="http://localhost:8030/book/images/${item.book.id}" 
                                        class="img-fluid rounded-start" 
                                        alt="${item.book.title}"
                                        style="object-fit: cover; height: 100px;">
                                </div>
                                <div class="col-md-7">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.book.title}</h5>
                                        <p class="card-text mb-0">Price: ₦${item.book.price.toFixed(2)}</p>
                                        <p class="card-text">Quantity: ${item.quantity}</p>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="card-body text-end">
                                        <h5 class="text-primary mb-3">₦${itemTotal.toFixed(2)}</h5>
                                        <button class="btn btn-sm btn-outline-danger" 
                                            onclick="removeFromCart('${item.id}')">
                                            <i class="fas fa-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <hr class="my-2">
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Update the summary section
        document.getElementById('subtotal').textContent = `₦${total.toFixed(2)}`;
        document.getElementById('total').textContent = `₦${total.toFixed(2)}`;
    };

    fetchCart();
}

// Checkout Button
document.getElementById('checkoutButton')?.addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!user) {
        alert('Please log in to checkout');
        return;
    }

    // Fetch the cart items
    const cartResponse = await fetch(`http://localhost:8030/cart/getCartDetails/${userId}`);
    const cart = await cartResponse.json();

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Calculate total price
    //const totalPrice = cart.reduce((total, item) => total + item.book.price * item.quantity, 0);

    // Create the order
    // const order = {
    //     studentId: userId,
    //     books: cart.map(item => ({
    //         bookId: item.book._id,
    //         quantity: item.quantity,
    //     })),
    //     totalPrice,
    // };

    // Send the order to the backend
    const response = await fetch(`http://localhost:8030/api/orders/checkout/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //body: JSON.stringify(userId),
    });

    if (response.ok) {
        alert('Order placed successfully');
        // Clear the cart
        // await fetch(`/api/cart/${user._id}`, {
        //     method: 'DELETE',
        // });
        window.location.reload(); // Refresh the page
        window.location.href = 'checkout.html';
    } else {
        alert('Failed to place order');
    }
});

// Fetch and Display Orders (Admin Dashboard).
if (window.location.pathname.endsWith('admin.html')) {
    const fetchOrders = async () => {
        try {
            // First, let's add console logs to debug the API call
            console.log('Fetching orders...');
            const response = await fetch('http://localhost:8030/api/orders/all');
            console.log('Response:', response);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const orders = await response.json();
            console.log('Orders data:', orders);

            const ordersContainer = document.getElementById('orders');
            
            // Check if orders is empty or undefined
            if (!orders || orders.length === 0) {
                ordersContainer.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4">
                            <div class="text-muted">
                                <i class="fas fa-inbox fa-3x mb-3"></i>
                                <p>No orders found</p>
                            </div>
                        </td>
                    </tr>`;
                return;
            }

            ordersContainer.innerHTML = orders.map(order => `
                <tr>
                    <td>
                        <span class="fw-bold">#${order.orderId || order.id}</span>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(order.username)}&background=random" 
                                class="rounded-circle me-2" 
                                width="32" 
                                height="32">
                            <div>
                                <div class="fw-bold">${order.username}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex flex-column">
                            ${order.books.map(book => `
                                <div class="mb-1">
                                    <span class="fw-bold">${book.title}</span>
                                    <span class="text-muted">× ${book.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                    </td>
                    <td>
                        <span class="fw-bold text-primary">₦${parseFloat(order.totalPrice).toLocaleString()}</span>
                    </td>
                    <td>
                        <div class="d-flex flex-column">
                            <span>${new Date(order.createdAt).toLocaleDateString()}</span>
                            <small class="text-muted">${new Date(order.createdAt).toLocaleTimeString()}</small>
                        </div>
                    </td>
                    <td>
                        ${getStatusBadge(order.status)}
                    </td>
                    <td>
                        <div class="btn-group">
                            ${!order.status ? `
                                <button class="btn btn-sm btn-success me-1" onclick="updateOrderStatus('${order.orderId || order.id}', 'approved')">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="btn btn-sm btn-danger me-1" onclick="updateOrderStatus('${order.orderId || order.id}', 'denied')">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : `
                                <button class="btn btn-sm btn-secondary" disabled>
                                    <i class="fas fa-lock"></i>
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `).join('');

            // Initialize DataTable with proper configuration
            if ($.fn.DataTable.isDataTable('#ordersTable')) {
                $('#ordersTable').DataTable().destroy();
            }

            $('#ordersTable').DataTable({
                pageLength: 10,
                order: [[4, 'desc']], // Sort by date column descending
                responsive: true,
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'collection',
                        text: '<i class="fas fa-download"></i> Export',
                        buttons: ['copy', 'excel', 'pdf', 'print']
                    }
                ]
            });

        } catch (err) {
            console.error('Error fetching orders:', err);
            const ordersContainer = document.getElementById('orders');
            ordersContainer.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="text-danger">
                            <i class="fas fa-exclamation-circle fa-3x mb-3"></i>
                            <p>Failed to load orders. Please try again later.</p>
                            <button class="btn btn-primary btn-sm mt-2" onclick="fetchOrders()">
                                <i class="fas fa-sync-alt me-1"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>`;
        }
    };

    // Helper function for status badges
    function getStatusBadge(status) {
        const badges = {
            'approved': '<span class="badge bg-success">Approved</span>',
            'denied': '<span class="badge bg-danger">Denied</span>',
            'pending': '<span class="badge bg-warning">Pending</span>'
        };
        return badges[status?.toLowerCase()] || '<span class="badge bg-secondary">Processing</span>';
    }

    // Call fetchOrders when the page loads
    fetchOrders();

    // Add event listeners for filters
    document.getElementById('statusFilter').addEventListener('change', function() {
        const table = $('#ordersTable').DataTable();
        table.draw();
    });

    document.getElementById('dateFilter').addEventListener('change', function() {
        const table = $('#ordersTable').DataTable();
        table.draw();
    });

    document.getElementById('orderSearch').addEventListener('keyup', function() {
        const table = $('#ordersTable').DataTable();
        table.search(this.value).draw();
    });
}

// Fetch and Display Order History
const fetchOrderHistory = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = JSON.parse(localStorage.getItem('userId'));
    if (!user) {
        alert('Please log in to view order history');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8030/api/orders/${userId}`); // Replace with your API endpoint
        const orders = await response.json();

        const ordersContainer = document.getElementById('orders');
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        console.log(orders);
        

        ordersContainer.innerHTML = orders.map(order => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">Order ID: ${order.id}</h5>
                    <p class="card-text"><strong>Books:</strong></p>
                    <ul>
                        ${order.books.map(book => `
                            <li>${book.title} (Quantity: ${book.quantity})</li>
                        `).join('')}
                    </ul>
                    <p class="card-text"><strong>Total Price:</strong> ₦${order.totalPrice}</p>
                    <p class="card-text"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        console.error('Error fetching order history:', err);
        document.getElementById('orders').innerHTML = '<p>Failed to load order history.</p>';
    }
};

// Call the function to fetch and display order history
if (window.location.pathname.endsWith('order-history.html')) {
    fetchOrderHistory();
}








// Remove from Cart
const removeFromCart = async (cartItemId) => {
    const response = await fetch(`http://localhost:8030/cart/delete/${cartItemId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Item removed from cart');
        window.location.reload();
    } else {
        alert('Failed to remove item from cart');
    }
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



// Forgot Password Form Submission
document.getElementById('forgotPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
});

// Reset Password Form Submission
document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const token = new URLSearchParams(window.location.search).get('token');

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        window.location.href = 'login.html';
    } else {
        alert(data.message);
    }
});     

// Add Event Listener for Mobile Menu
// const mobileMenuButton = document.createElement('button');
// mobileMenuButton.innerHTML = '☰';
// mobileMenuButton.classList.add('mobile-menu-button');
// mobileMenuButton.onclick = toggleSidebar;

// Send Message to Admin (Student Dashboard)
document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = JSON.parse(localStorage.getItem('userId'));
    const message = document.getElementById('messageContent').value;

    try {
        const response = await fetch('http://localhost:8030/messages/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                message,
                isAdminMessage: false
            }),
        });

        if (response.ok) {
            alert('Message sent successfully');
            document.getElementById('messageContent').value = ''; // Clear the input
            fetchMessages(); // Refresh messages
        } else {
            alert('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message');
    }
});

// Fetch Messages (For both Student and Admin)
const fetchMessages = async (userId = null) => {
    if (window.location.pathname.endsWith('admin-chat.html') && !userId) {
        return;
    }

    try {
        const endpoint = userId 
            ? `http://localhost:8030/messages/${userId}`
            : `http://localhost:8030/messages/${JSON.parse(localStorage.getItem('userId'))}`;
        
        const response = await fetch(endpoint);
        const messages = await response.json();
        
        const messagesContainer = document.getElementById('messagesContainer');
        if (messagesContainer) {
            messagesContainer.innerHTML = messages.map(msg => `
                <div class="chat-message ${msg.isAdminMessage ? 'sent' : 'received'}">
                    <div class="message-content">
                        ${msg.message}
                    </div>
                    <div class="message-time">
                        ${msg.isAdminMessage ? 'You' : msg.userName} • ${new Date(msg.timestamp).toLocaleString()}
                    </div>
                </div>
            `).join('');

            // Scroll to bottom
            const chatContainer = document.getElementById('chat-container');
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

// Admin Reply to Message
const replyToMessage = async (messageId, studentId) => {
    const replyContent = document.getElementById(`reply-${messageId}`).value;
    
    try {
        const response = await fetch('http://localhost:8030/messages/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: studentId,
                message: replyContent,
                isAdminMessage: true
            }),
        });

        if (response.ok) {
            alert('Reply sent successfully');
            document.getElementById(`reply-${messageId}`).value = '';
            fetchMessages(); // Refresh messages
        } else {
            alert('Failed to send reply');
        }
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('Error sending reply');
    }
};

// Initialize messages if on relevant pages
if (window.location.pathname.endsWith('student-chat.html') || 
    window.location.pathname.endsWith('admin-chat.html')) {
    fetchMessages();
}


    function searchBooks() {
        let input = document.getElementById("searchBar").value.toLowerCase();
        let books = document.querySelectorAll("#books .col-md-4");

        books.forEach(book => {
            let title = book.querySelector(".card-title").textContent.toLowerCase();
            if (title.includes(input)) {
                book.style.display = "block"; // Show if it matches
            } else {
                book.style.display = "none"; // Hide if it doesn't match
            }
        });
    }



let currentSelectedUser = null;

const fetchChatList = async () => {
    try {
        const response = await fetch('http://localhost:8030/messages/all');
        const messages = await response.json();
        
        // Group messages by user
        const userMessages = {};
        messages.forEach(msg => {
            if (!msg.isAdminMessage) {
                if (!userMessages[msg.userId]) {
                    userMessages[msg.userId] = {
                        userName: msg.userName,
                        messages: [],
                        lastMessage: msg.timestamp
                    };
                }
                userMessages[msg.userId].messages.push(msg);
                if (new Date(msg.timestamp) > new Date(userMessages[msg.userId].lastMessage)) {
                    userMessages[msg.userId].lastMessage = msg.timestamp;
                }
            }
        });

        // Render chat list
        const chatList = document.getElementById('chatList');
        if (chatList) {
            chatList.innerHTML = Object.entries(userMessages)
                .sort((a, b) => new Date(b[1].lastMessage) - new Date(a[1].lastMessage))
                .map(([userId, data]) => `
                    <div class="chat-list-item list-group-item list-group-item-action ${currentSelectedUser === userId ? 'active' : ''}"
                         onclick="selectChat('${userId}', '${data.userName}')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="user-status ${data.messages.length > 0 ? 'status-online' : 'status-offline'}"></span>
                                <strong>${data.userName}</strong>
                            </div>
                            ${data.messages.some(msg => !msg.read) ? 
                                '<span class="unread-badge">New</span>' : ''}
                        </div>
                        <small class="text-muted">
                            Last message: ${new Date(data.lastMessage).toLocaleString()}
                        </small>
                    </div>
                `).join('');
        }
    } catch (error) {
        console.error('Error fetching chat list:', error);
    }
};

const selectChat = (userId, userName) => {
    currentSelectedUser = userId;
    document.getElementById('currentChatUser').textContent = userName;
    fetchMessages(userId);
    
    // Update active state in chat list
    document.querySelectorAll('.chat-list-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
};

// Add admin reply form handler
document.getElementById('adminReplyForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentSelectedUser) {
        alert('Please select a conversation first');
        return;
    }

    const message = document.getElementById('replyMessage').value;
    try {
        const response = await fetch('http://localhost:8030/messages/reply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentSelectedUser,
                message,
                isAdminMessage: true
            }),
        });

        if (response.ok) {
            document.getElementById('replyMessage').value = '';
            fetchMessages(currentSelectedUser);
        }
    } catch (error) {
        console.error('Error sending reply:', error);
    }
});

// Initialize admin chat
if (window.location.pathname.endsWith('admin-chat.html')) {
    fetchChatList();
    setInterval(fetchChatList, 5000); // Update chat list every 5 seconds
}

