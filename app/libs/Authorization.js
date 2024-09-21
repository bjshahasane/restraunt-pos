import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
  const authHeader = req.headers.get('authorization');  // Extract Authorization header
  if (!authHeader) {
    throw new Error('Authorization header is missing'); // Handle missing header
  }

  const token = authHeader.split(' ')[1];  // Extract the token (Bearer <token>)
  if (!token) {
    throw new Error('Token not found'); // Handle missing token
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    return decoded; // Return the decoded payload if the token is valid
  } catch (error) {
    throw new Error('Invalid or expired token');  // Handle token validation failure
  }
};
