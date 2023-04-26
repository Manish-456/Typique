import { Routes, Route } from "react-router-dom";
import Layout from "./Routes/Layout";
import Home from "./Pages/Home";
import AuthPoint from "./Pages/AuthPoint";
import ResetPassword from "./Pages/ResetPassword";
import Recovery from "./Pages/Recovery";
import Category from "./Pages/Category";
import Explores from "./Pages/Explores";
import Blog from "./Pages/Blog";
import Profile from "./Pages/Profile";
import CreateBlog from "./Pages/CreateBlog";
import PersistLogin from "./Features/auth/PersistLogin";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";
import Welcome from "./Pages/Welcome";
import RequireEmail from "./Routes/RequireEmail";
import TopStoriesPage from "./Pages/TopStoriesPage";



function App() {
  const { theme } = useContext(ThemeContext);
  
  return (

    <div className={`relative  ${theme.textColor} ${theme.primary} `}>
      <Routes>
        <Route path="/auth" element={<AuthPoint />} />
        <Route element={<RequireEmail />} >
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/recovery" element={<Recovery />} />
        </Route>
          <Route path="/" element={<Welcome />} />
          {/* Public route */}

          {/* Require Auth || Protected Route */}
      
            <Route element={<PersistLogin />}>
        <Route  element={<Layout />}>
   
              <Route path="home" element={<Home />} />
                <Route path="category" element={<Category />} />
                <Route path="explore" element={<Explores />} />
                <Route path="blog/:blogId" element={<Blog />} />
                <Route path="profile/:userId" element={<Profile />} />
                <Route path="create/blog" element={<CreateBlog />} />
                <Route path="blog/update/:id" element={<CreateBlog />} />
                <Route path="topstories" element={<TopStoriesPage />} />
           </Route>
              </Route>
  
      </Routes>
    </div>
   
  );
}

export default App;
