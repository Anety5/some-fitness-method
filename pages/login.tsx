import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/SOME fitness logo 1_1752967200752.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });
  
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest("/api/auth/login", "POST", loginForm);
      const data = await response.json();
      
      if (data.success) {
        login(data.user); // This updates auth context and localStorage
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${data.user.firstName}!`,
        });
        setLocation("/");
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to log in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("/api/auth/register", "POST", {
        username: registerForm.username,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName
      });
      
      const data = await response.json();
      
      if (data.success) {
        login(data.user); // This updates auth context and localStorage
        toast({
          title: "Welcome to S.O.M.E fitness!",
          description: `Account created successfully for ${data.user.firstName}!`,
        });
        setLocation("/");
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Please try a different username",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Unable to create account. Please check your internet connection.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    // Create a guest user session
    const guestUser = {
      id: 0,
      username: "guest",
      firstName: "Guest",
      lastName: "User"
    };
    login(guestUser); // This updates auth context and localStorage
    toast({
      title: "Welcome to S.O.M.E fitness!",
      description: "You're using guest mode. Create an account later to save your progress.",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={logoPath} 
              alt="S.O.M.E fitness" 
              className="w-16 h-16 rounded-lg shadow-lg"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            S.O.M.E fitness
          </CardTitle>
          <p className="text-gray-600">Sleep • Oxygen • Move • Eat</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="regUsername">Username</Label>
                  <Input
                    id="regUsername"
                    type="text"
                    value={registerForm.username}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="regPassword">Password</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 text-center border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Want to try the app first?
            </p>
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Skip for now - Use as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}