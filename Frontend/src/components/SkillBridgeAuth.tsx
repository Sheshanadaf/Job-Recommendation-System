import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

const SkillBridgeAuth = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Sign Up Form State
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Log In Form State
  const [logInData, setLogInData] = useState({
    email: '',
    password: ''
  });
  
  // Validation States
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});
  const [logInErrors, setLogInErrors] = useState<Record<string, string>>({});

  const validateSignUp = () => {
    const errors: Record<string, string> = {};
    
    if (!signUpData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!signUpData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!signUpData.password) {
      errors.password = 'Password is required';
    } else if (signUpData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLogIn = () => {
    const errors: Record<string, string> = {};
    
    if (!logInData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(logInData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!logInData.password) {
      errors.password = 'Password is required';
    }
    
    setLogInErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignUp()) {
      navigate('/profile');
    }
  };

  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogIn()) {
      navigate('/profile');
    }
  };

  const getInputClasses = (hasError: boolean, hasValue: boolean) => {
    let classes = "w-full px-4 py-3 rounded-lg border transition-all duration-200 font-inter text-foreground bg-background ";
    
    if (hasError) {
      classes += "error-border focus:error-border ";
    } else if (hasValue) {
      classes += "success-border focus:success-border ";
    } else {
      classes += "border-input focus-glow ";
    }
    
    return classes;
  };

  return (
    <div 
      className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in relative"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.05)), url('/src/assets/auth-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/80"></div>
      
      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-2 font-inter tracking-tight">
            Skill Bridge
          </h1>
          <p className="text-lg text-muted-foreground font-inter">
            Connect Your Skills to Your Future
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Sign Up Panel */}
          <Card className="p-8 soft-shadow border-0">
            <h2 className="text-2xl font-semibold text-foreground mb-6 font-inter tracking-tight">
              Sign Up
            </h2>
            
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <Label htmlFor="signup-fullname" className="text-sm font-medium text-foreground mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                  className={getInputClasses(!!signUpErrors.fullName, !!signUpData.fullName)}
                  required
                />
                {signUpErrors.fullName && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{signUpErrors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-email" className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                  className={getInputClasses(!!signUpErrors.email, !!signUpData.email)}
                  required
                />
                {signUpErrors.email && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{signUpErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-password" className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                    className={getInputClasses(!!signUpErrors.password, !!signUpData.password)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-muted-foreground text-sm mt-1">Must be at least 8 characters</p>
                {signUpErrors.password && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{signUpErrors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-confirm-password" className="text-sm font-medium text-foreground mb-2 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                    className={getInputClasses(!!signUpErrors.confirmPassword, !!signUpData.confirmPassword)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {signUpErrors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{signUpErrors.confirmPassword}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 btn-hover"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </Card>

          {/* Log In Panel */}
          <Card className="p-8 soft-shadow border-0">
            <h2 className="text-2xl font-semibold text-foreground mb-6 font-inter tracking-tight">
              Log In
            </h2>
            
            <form onSubmit={handleLogIn} className="space-y-6">
              <div>
                <Label htmlFor="login-email" className="text-sm font-medium text-foreground mb-2 block">
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={logInData.email}
                  onChange={(e) => setLogInData({...logInData, email: e.target.value})}
                  className={getInputClasses(!!logInErrors.email, !!logInData.email)}
                  required
                />
                {logInErrors.email && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{logInErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="login-password" className="text-sm font-medium text-foreground mb-2 block">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={logInData.password}
                    onChange={(e) => setLogInData({...logInData, password: e.target.value})}
                    className={getInputClasses(!!logInErrors.password, !!logInData.password)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {logInErrors.password && (
                  <p className="text-destructive text-sm mt-1 animate-shake">{logInErrors.password}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 btn-hover"
                >
                  Log In
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillBridgeAuth;