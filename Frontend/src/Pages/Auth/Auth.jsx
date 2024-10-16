import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { clearError, setCredentials } from "../../Redux/Slicer/Auth"; // Import setCredentials
import { LoginUser, RegisterUser } from "../../Redux/Reducer/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = ({ isLogin = true }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [isLogin, dispatch]);

  const handleLogin = async (email, password) => {
    const responseData = await LoginUser({ email, password });
    if (responseData.token && responseData.user) {
      dispatch(
        setCredentials({
          token: responseData.token,
          user: responseData.user,
        })
      );
      toast.success("Login successful!");
      navigate("/");
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const responseData = await RegisterUser({ name, email, password });
      if (responseData) {
        toast.success("Registration successful! Please login.");

        setEmail("");
        setPassword("");
        setName("");

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin(email, password);
      } else {
        await handleRegister(name, email, password);

        setEmail("");
        setPassword("");
        setName("");
        toast.success("Registration successful! Please login.");

        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
      dispatch(clearError());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#ecebec] items-center justify-center">
      <div className="flex w-1/2 my-20 flex-col py-20 px-8 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isLogin ? "Welcome back!" : "Create an account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "The faster you fill up, the faster you get a Room"
                : "Sign up to get started"}
            </p>
          </div>
          {error && (
            <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="grid gap-6 mt-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {!isLogin && (
                  <div className="grid gap-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link className="text-sm underline" to="/forgot-password">
                      Forgot Password?
                    </Link>
                  </div>
                )}
                <Button
                  className="w-full bg-black text-white hover:bg-gray-800"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" type="button">
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign {isLogin ? "in" : "up"} with Google
            </Button>
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Link
              className="underline ml-1"
              to={isLogin ? "/register" : "/login"}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
