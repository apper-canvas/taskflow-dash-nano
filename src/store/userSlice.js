import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // Validate and normalize user object to prevent undefined property errors
      if (action.payload) {
        const validatedUser = {
          ...action.payload,
// Ensure role is always defined - check multiple possible locations
          role: action.payload.role || 
                action.payload.accounts?.[0]?.role || 
                action.payload.accounts?.[0]?.UserRole ||
                action.payload.UserRole ||
                (() => {
                  // Debug logging if role not found
                  console.log('Redux: Role not found in expected locations. Payload:', action.payload);
                  return 'user';
                })(),
          // Normalize name from various possible properties
          name: action.payload.name || 
                action.payload.firstName || 
                'User',
          // Normalize email from possible properties
          email: action.payload.email || 
                 action.payload.emailAddress || 
                 ''
        };
        state.user = JSON.parse(JSON.stringify(validatedUser));
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;