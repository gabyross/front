import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { isValidEmail } from '../utils/validators';
import styles from './RecoverPassword.module.css';

/**
 * Password recovery page
 */
const RecoverPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid to enable button
  const isFormValid = () => {
    return formData.email.trim();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement real recovery logic
      console.log('Recovery request for:', formData.email);
      
      // Show success message
      setEmailSent(true);
      
    } catch (error) {
      console.error('Recovery error:', error);
      setErrors({
        general: 'Error sending email. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If email was sent, show confirmation message
  if (emailSent) {
    return (
      <Layout showFooter={false}>
        <main className={styles.recoverPage}>
          <div className={styles.recoverContainer}>
            <div className={styles.recoverCard}>
              <div className={styles.recoverHeader}>
                <Link to="/" className={styles.logoLink}>
                  SmartStocker
                </Link>
                <div className={styles.successIcon}>
                  ✓
                </div>
                <h1 className={styles.recoverTitle}>
                  Email Sent
                </h1>
                <p className={styles.recoverSubtitle}>
                  We've sent password reset instructions to <strong>{formData.email}</strong>
                </p>
              </div>

              <div className={styles.recoverFooter}>
                <p className={styles.instructionsText}>
                  Check your inbox and follow the instructions in the email. 
                  If you don't see it, check your spam folder.
                </p>
                
                <div className={styles.backToLogin}>
                  <Link to="/login" className={styles.backLink}>
                    ← Back to login
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional information */}
            <div className={styles.recoverInfo}>
              <h2 className={styles.infoTitle}>
                Need help?
              </h2>
              <ul className={styles.infoList}>
                <li>The email may take a few minutes to arrive</li>
                <li>Check your spam or junk folder</li>
                <li>The recovery link expires in 24 hours</li>
                <li>If you don't receive the email, try again</li>
              </ul>
              
              <div className={styles.contactInfo}>
                <p className={styles.contactText}>
                  Still having trouble? <br />
                  <strong>Contact us:</strong> support@smartstocker.com
                </p>
              </div>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <main className={styles.recoverPage}>
        <div className={styles.recoverContainer}>
          <div className={styles.recoverCard}>
            {/* Header */}
            <div className={styles.recoverHeader}>
              <Link to="/" className={styles.logoLink} aria-label="Back to home">
                SmartStocker
              </Link>
              <h1 className={styles.recoverTitle}>
                Recover Password
              </h1>
              <p className={styles.recoverSubtitle}>
                Enter your email address and we'll send you instructions to reset your password
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.recoverForm} noValidate>
              {errors.general && (
                <div className={styles.generalError} role="alert">
                  {errors.general}
                </div>
              )}

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
                autoFocus
              />

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Instructions'}
              </Button>
            </form>

            {/* Additional links */}
            <div className={styles.recoverFooter}>
              <div className={styles.backToLogin}>
                <Link to="/login" className={styles.backLink}>
                  ← Back to login
                </Link>
              </div>
              
              <div className={styles.signupPrompt}>
                <span>Don't have an account?</span>
                <Link to="/register" className={styles.signupLink}>
                  Create account
                </Link>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className={styles.recoverInfo}>
            <h2 className={styles.infoTitle}>
              Secure Recovery
            </h2>
            <ul className={styles.infoList}>
              <li>Completely secure process</li>
              <li>Link expires in 24 hours</li>
              <li>Only you can access the link</li>
              <li>Your data is protected</li>
            </ul>
            
            <div className={styles.trustIndicators}>
              <p className={styles.trustText}>
                <strong>Security guaranteed</strong> with end-to-end encryption
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default RecoverPassword;