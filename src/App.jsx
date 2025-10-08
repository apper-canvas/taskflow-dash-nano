import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "@/store/store";
import { clearUser, setUser } from "@/store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import Users from "@/components/pages/Users";
import ProjectDetail from "@/components/pages/ProjectDetail";
import Tasks from "@/components/pages/Tasks";
import Dashboard from "@/components/pages/Dashboard";
import Projects from "@/components/pages/Projects";
import Sidebar from "@/components/organisms/Sidebar";

export const AuthContext = createContext(null);

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
const { user, isAuthenticated } = useSelector((state) => state.user || {});

useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        try {
          console.log("Authentication successful, user object:", user);
          setIsInitialized(true);
          let currentPath = window.location.pathname + window.location.search;
          let redirectPath = new URLSearchParams(window.location.search).get('redirect');
          const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                             currentPath.includes('/callback') || currentPath.includes('/error') || 
                             currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
          
          if (user) {
            // Validate and sanitize user object before storing
            const validatedUser = {
              ...user,
              role: user.role || user.accounts?.[0]?.role || 'user',
              name: user.name || user.firstName || 'User',
              email: user.email || user.emailAddress || ''
            };
            
            if (redirectPath) {
              navigate(redirectPath);
            } else if (!isAuthPage) {
              if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                navigate(currentPath);
              } else {
                navigate('/');
              }
            } else {
              navigate('/');
            }
            dispatch(setUser(JSON.parse(JSON.stringify(validatedUser))));
          } else {
            if (!isAuthPage) {
              navigate(
                currentPath.includes('/signup')
                  ? `/signup?redirect=${currentPath}`
                  : currentPath.includes('/login')
                  ? `/login?redirect=${currentPath}`
                  : '/login'
              );
            } else if (redirectPath) {
              if (
                !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
              ) {
                navigate(`/login?redirect=${redirectPath}`);
              } else {
                navigate(currentPath);
              }
            } else if (isAuthPage) {
              navigate(currentPath);
            } else {
              navigate('/login');
            }
            dispatch(clearUser());
          }
        } catch (error) {
          console.error("Error in authentication onSuccess handler:", error);
          setIsInitialized(true);
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, []);

  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="m16.2 7.8 2.9-2.9"></path>
          <path d="M18 12h4"></path>
          <path d="m16.2 16.2 2.9 2.9"></path>
          <path d="M12 18v4"></path>
          <path d="m4.9 19.1 2.9-2.9"></path>
          <path d="M2 12h4"></path>
          <path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  return (
<AuthContext.Provider value={authMethods}>
      <div className="flex min-h-screen bg-[#f8fafc]">
        {isAuthenticated && <Sidebar currentUser={user} />}
        <main className={`flex-1 ${isAuthenticated ? 'lg:ml-0' : ''} p-6 lg:p-8 overflow-x-hidden`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
            <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
            <Route path="/" element={isAuthenticated ? <Dashboard currentUser={user} /> : <Login />} />
            <Route path="/projects" element={isAuthenticated ? <Projects currentUser={user} /> : <Login />} />
            <Route path="/projects/:id" element={isAuthenticated ? <ProjectDetail currentUser={user} /> : <Login />} />
            <Route path="/tasks" element={isAuthenticated ? <Tasks currentUser={user} /> : <Login />} />
            <Route path="/users" element={isAuthenticated ? <Users currentUser={user} /> : <Login />} />
          </Routes>
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </AuthContext.Provider>
  );
}
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;