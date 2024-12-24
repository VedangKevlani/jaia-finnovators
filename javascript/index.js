const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Get a reference to Firestore
const db = admin.firestore();

// Example function to add a document to Firestore
async function addDocument() {
    const docRef = db.collection('users').doc('userId');
    await docRef.set({
        name: 'Vedang Kevlani',
        email: 'kevlanivedang28@gmail.com'
    });
    console.log('Document added!');
}

addDocument();
