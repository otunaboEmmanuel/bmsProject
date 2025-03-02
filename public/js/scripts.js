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
    if (username) {
        const usernameElement = document.getElementById('displayUsername');
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    } else {
        // Redirect to login if no username is found
        //window.location.href = 'login.html';
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
                        <div class="card">
                            <img src="${imageUrl}" class="card-img-top" alt="${book.title}">
                            <div class="card-body">
                                <h5 class="card-title">${book.title}</h5>
                                <p class="card-text">${book.author}</p>
                                <p class="card-text">₦${book.price}</p>
                                <p class="card-text">Quantity: ${book.quantity}</p>
                                <p class="card-text">${book.level} LVL</p>
                                <button class="btn btn-primary" onclick="addToCart('${book.bookId}')">Add to Cart</button
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
                        <div class="card">
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
        const response = await fetch('http://localhost:8030/students/allStudents');
        const students = await response.json();
        console.log(students.profile);

        let studentsContainer = document.querySelector('.content')

        students.profile.forEach(student => {
            html = `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${student.userName}</h5>
                    <p class="card-text">${student.email}</p>
                    <!--<p class="card-text">Role: ${student.role}</p>-->
                    <button class="btn btn-danger delStud" onclick="deleteStudent('${student.userId}')">Delete</button>
                </div>
            </div>
        `
            studentsContainer.insertAdjacentHTML('afterend', html)
        })


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
        cartContainer.innerHTML = cart.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.book.title}</h5>
                    <p class="card-text">Price: ₦${item.book.price}</p>
                    <p class="card-text">Quantity: ${item.quantity}</p>
                    <button class="btn btn-danger" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        `).join('');
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
    } else {
        alert('Failed to place order');
    }
});

// Fetch and Display Orders (Admin Dashboard).
if (window.location.pathname.endsWith('admin.html')) {
const fetchOrders = async () => {
    try {
        const response = await fetch('http://localhost:8030/api/orders/all'); // Replace with your API endpoint
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
                    <p class="card-text"><strong>Student:</strong> ${order.username}</p>
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
        console.error('Error fetching orders:', err);
        document.getElementById('orders').innerHTML = '<p>Failed to load orders.</p>';
    }
};

// Call the function to fetch and display orders
fetchOrders();
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
const fetchMessages = async () => {
    const userId = JSON.parse(localStorage.getItem('userId'));
    const userRole = JSON.parse(localStorage.getItem('user'));
    const isAdmin = userRole.toLowerCase() === 'admin';
    
    try {
        const endpoint = isAdmin 
            ? 'http://localhost:8030/messages/all' // Admin sees all messages
            : `http://localhost:8030/messages/${userId}`; // Students see their own messages
        
        const response = await fetch(endpoint);
        const messages = await response.json();
        
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = messages.map(msg => `
            <div class="card mb-2 ${msg.isAdminMessage ? 'bg-light' : ''}">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${msg.isAdminMessage ? 'Admin' : msg.userName} - 
                        ${new Date(msg.timestamp).toLocaleString()}
                    </h6>
                    <p class="card-text">${msg.message}</p>
                    ${isAdmin && !msg.isAdminMessage ? `
                        <div class="reply-form">
                            <input type="text" class="form-control mb-2" placeholder="Type your reply..." id="reply-${msg._id}">
                            <button class="btn btn-primary" onclick="replyToMessage('${msg._id}', '${msg.userId}')">Reply</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
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