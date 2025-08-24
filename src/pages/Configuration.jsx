import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Settings, Clock, Package, Bell } from 'lucide-react';
import styles from './Configuration.module.css';

/**
 * Configuration page for restaurant settings
 */
const Configuration = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    cuisineType: '',
    operatingHours: {
      open: '',
      close: ''
    },
    notifications: {
      lowStock: true,
      dailyReports: false
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.configurationPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Configuration</h1>
            <p className={styles.subtitle}>
              Manage your restaurant settings and preferences
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <Settings size={24} />
                <h2 className={styles.sectionTitle}>Restaurant Information</h2>
              </div>
              
              <div className={styles.form}>
                <Input
                  type="text"
                  name="restaurantName"
                  label="Restaurant Name"
                  placeholder="Your restaurant name"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                />
                
                <Input
                  type="text"
                  name="address"
                  label="Address"
                  placeholder="Restaurant address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.actions}>
              <Button variant="primary" size="large">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Configuration;