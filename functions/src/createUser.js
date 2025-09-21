const admin = require('firebase-admin');

// Function to handle user registration
const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Create user using Firebase Admin SDK
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password
    });

    console.log('User created successfully:', userRecord.uid);
    console.log('User email:', userRecord.email);

    // You can add additional user data to Firestore here
    // Example: await admin.firestore().collection('users').doc(userRecord.uid).set({...});

    res.status(201).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error.code, error.message);

    // Handle specific errors
    let errorMessage = 'Registration failed';
    let statusCode = 500;

    switch (error.code) {
      case 'auth/email-already-exists':
        errorMessage = 'This email is already registered';
        statusCode = 409;
        break;
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address';
        statusCode = 400;
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        statusCode = 400;
        break;
      default:
        errorMessage = error.message || 'Registration failed';
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code
    });
  }
};

// Export the function
module.exports = { createUser };