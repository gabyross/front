import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import styles from './InventoryManagement.module.css';

/**
 * Inventory management page
 */
const InventoryManagement = () => {
  const [inventory] = useState([
    {
      id: 1,
      name: 'Tomato',
      currentStock: 5.5,
      minimumStock: 10,
      unit: 'kg',
      status: 'low'
    },
    {
      id: 2,
      name: 'Onion',
      currentStock: 0,
      minimumStock: 5,
      unit: 'kg',
      status: 'critical'
    }
  ]);

  return (
    <Layout isInternal={true}>
      <main className={styles.inventoryPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Inventory Management</h1>
            <p className={styles.subtitle}>
              Monitor and manage your restaurant inventory
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.alerts}>
              <div className={styles.alertCard}>
                <AlertTriangle size={24} />
                <div>
                  <h3>Low Stock Alert</h3>
                  <p>2 ingredients need restocking</p>
                </div>
              </div>
            </div>

            <div className={styles.inventoryList}>
              {inventory.map(item => (
                <div key={item.id} className={styles.inventoryItem}>
                  <div className={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p>{item.currentStock} {item.unit} / {item.minimumStock} {item.unit}</p>
                  </div>
                  <div className={`${styles.status} ${styles[item.status]}`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default InventoryManagement;