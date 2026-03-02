export const getFirebaseErrorMessage = (error) => {
  console.log('Firebase error full:', error);

  const code =
    error?.code ||
    (error?.message?.includes('invalid-credential')
      ? 'auth/invalid-credential'
      : null);

  switch (code) {
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    default:
      return 'Login failed. Please check your credentials.';
  }
};