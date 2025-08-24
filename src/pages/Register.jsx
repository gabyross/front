import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Checkbox from '../components/common/Checkbox';
import { isValidEmail, isValidPassword, passwordsMatch, isValidFullName } from '../utils/validators';
import styles from './Register.module.css';

/**
 * User registration page
 */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    
    // Clear field error when user starts typing/changing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate complete form
  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (!isValidFullName(formData.fullName)) {
      newErrors.fullName = 'Please enter your first and last name';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password, 8)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Validate password confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate terms and conditions
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid to enable button
  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.acceptTerms
    );
  };

  // Registration handler (stub for future integration)
  const onRegister = async (userData) => {
    // TODO: Integrate with registration API
    console.log('Registration data:', userData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to login without showing alert
    navigate('/login');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onRegister(formData);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        general: 'Error creating account. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <main className={styles.registerPage}>
        <div className={styles.registerContainer}>
          <div className={styles.registerCard}>
            <div className={styles.registerHeader}>
              <Link to="/" className={styles.logoLink}>
                SmartStocker
              </Link>
              <h1 className={styles.registerTitle}>
                Create Account
              </h1>
              <p className={styles.registerSubtitle}>
                Join SmartStocker and optimize your restaurant
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.registerForm} noValidate>
              {errors.general && (
                <div className={styles.generalError} role="alert">
                  {errors.general}
                </div>
              )}

              <Input
                type="text"
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
                required
                autoComplete="name"
                autoFocus
              />

              <Input
                type="email"
                name="email"
                label="Email Address"
                placeholder="your@restaurant.com"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                autoComplete="email"
              />

              <PasswordInput
                name="password"
                label="Password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                error={errors.password}
                required
                autoComplete="new-password"
              />

              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />

              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                error={errors.acceptTerms}
                required
              >
                <span>
                  I accept the{' '}
                  <a 
                    href="/terms" 
                    className={styles.termsLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    terms and conditions
                  </a>
                  {' '}and{' '}
                  <a 
                    href="/privacy" 
                    className={styles.termsLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    privacy policy
                  </a>
                </span>
              </Checkbox>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Additional links */}
            <div className={styles.registerFooter}>
              <div className={styles.loginPrompt}>
                <span>Already have an account?</span>
                <Link to="/login" className={styles.loginLink}>
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className={styles.registerInfo}>
            <h2 className={styles.infoTitle}>
              Start optimizing your restaurant today
            </h2>
            <ul className={styles.infoList}>
              <li>Accurate sales predictions</li>
              <li>Automatic inventory optimization</li>
              <li>Reduce waste by up to 40%</li>
              <li>Detailed analytics and reports</li>
              <li>Specialized support for restaurants</li>
            </ul>
            
            <div className={styles.trustIndicators}>
              <p className={styles.trustText}>
                <strong>+500 restaurants</strong> already trust SmartStocker
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Register;