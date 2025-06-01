const express = require('express');
const User = require('../models/Users');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; // Fallback for development

const authenticateToken = (req, res, next) => {
    // Get token from Authorization header (Bearer TOKEN)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

    if (token == null) {
        console.log('Authentication failed: No token provided.');
        return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Authentication failed: Invalid token.', err.message);
            return res.status(403).json({ message: 'Authentication failed: Invalid token.' });
        }
        req.user = user; // Attach decoded user payload to the request
        next(); // Proceed to the next middleware/route handler
    });
};

// POST /signup - Register a new user
router.post('/register', async (req, res) => {
    const { username, password, role, scope, scopeId } = req.body;

    // Basic input validation
    const missingFields = [];

    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!role) missingFields.push('role');
    if (!scope) missingFields.push('scope');
    if (!scopeId) missingFields.push('scopeId');

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this user Name already exists.' });
        }

        // Hash the password before saving to database
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

        // Create new user in the database
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            scope,
            scopeId
        });

        // Respond with success message (don't send hashed password back)
        res.status(200).json({ message: 'User registered successfully!', username: newUser.username });

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ message: 'Server error during signup.', error: error.message });
    }
});

// POST /signin - Authenticate user and generate JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        // Payload contains non-sensitive user info (id, username)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Respond with token and user info
        res.status(200).json({ message: 'Signed in successfully!', token: token, username: user.username });

    } catch (error) {
        console.error('Error during user signin:', error);
        res.status(500).json({ message: 'Server error during signin.', error: error.message });
    }
});

// --- 10. Protected User Management Routes (CRUD) ---

// GET /users - Get all users (Protected route)
// Only authenticated users can access this.
router.get('/users', authenticateToken, async (req, res) => {
    console.log('GET /users - Fetching all users (Protected)');
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude password from the response
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users.', error: error.message });
    }
});

// GET /users/:id - Get a single user by ID (Protected route)
router.get('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    console.log(`GET /users/${userId} - Fetching user (Protected)`);
    try {
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Exclude password from the response
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error fetching user.', error: error.message });
    }
});

// POST /users - Create a new user (Protected route - typically for admin or specific roles)
// In a real app, this might be restricted to admin users, or only accessible via signup.
router.post('/users', authenticateToken, async (req, res) => {
    const { username, password, role, scope, scopeId } = req.body; // Password is required for new user creation

    // Basic input validation
    const missingFields = [];

    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');
    if (!role) missingFields.push('role');
    if (!scope) missingFields.push('scope');
    if (!scopeId) missingFields.push('scopeId');

    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    try {
        const existingUser = await User.findOne({ where: { username: username } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role,
            scope,
            scopeId
        });

        res.status(201).json({ message: 'User created successfully!', userId: newUser.id, username: newUser.username });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error creating user.', error: error.message });
    }
});

// PUT /users/:id - Update an existing user (Protected route)
// A user should typically only be able to update their own profile, or an admin can update any.
// For simplicity, this allows any authenticated user to update any user if they know the ID.
router.put('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { username, password } = req.body; // Password update is optional

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update fields if provided in the request body
        if (username) user.username = username;
        if (password) {
            user.password = await bcrypt.hash(password, 10); // Re-hash new password
        }

        await user.save(); // Save changes to the database

        // Respond with updated user data (excluding password)
        const updatedUser = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ message: 'User updated successfully!', user: updatedUser });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error updating user.', error: error.message });
    }
});

// DELETE /users/:id - Delete a user (Protected route)
// This route should typically be restricted to admin users.
router.delete('/users/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    console.log(`DELETE /users/${userId} - Deleting user (Protected)`);
    try {
        const deletedRowCount = await User.destroy({
            where: { id: userId }
        });

        if (deletedRowCount > 0) {
            res.status(204).send(); // 204 No Content for successful deletion
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error deleting user.', error: error.message });
    }
});
module.exports = router;