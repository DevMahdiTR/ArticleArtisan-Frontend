import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { AuthProvider } from "./frontend/Components/authContext/authContext";
import store from './frontend/redux/store';
import {
  Login,
  SignUp,
  Course,
  PageContent,
  PrivateRoute,
  Loader,
  ArticleDetails,
  ScrollToTop,
  Layout
} from "./frontend/Components/index";
import { DashBoard, Home, About, Contact } from "./frontend/pages/index";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Loader />
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Course />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pageContent" element={<PageContent />} />
              <Route path="/article/:articleId" element={<ArticleDetails />} />
              <Route path="/dashboard"element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </Provider>
    </div>
  );
}

export default App;
