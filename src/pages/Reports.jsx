import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import styles from './Reports.module.css';

/**
 * Reports and analytics page
 */
const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [reportData] = useState({
    totalSales: 15420,
    topItem: 'Pizza Margherita',
    efficiency: 87,
    waste: 12
  });

  const handleExportPDF = () => {
    console.log('Exporting PDF report...');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel report...');
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.reportsPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Reports & Analytics</h1>
            <p className={styles.subtitle}>
              Detailed insights and performance analysis
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Time Period</label>
                  <select 
                    className={styles.select}
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                  </select>
                </div>
              </div>

              <div className={styles.exportButtons}>
                <Button variant="secondary" onClick={handleExportPDF}>
                  <Download size={16} />
                  Export PDF
                </Button>
                <Button variant="secondary" onClick={handleExportExcel}>
                  <Download size={16} />
                  Export Excel
                </Button>
              </div>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metricCard}>
                <BarChart3 size={32} />
                <div>
                  <h3>Total Sales</h3>
                  <p className={styles.value}>${reportData.totalSales}</p>
                </div>
              </div>

              <div className={styles.metricCard}>
                <TrendingUp size={32} />
                <div>
                  <h3>Top Selling Item</h3>
                  <p className={styles.value}>{reportData.topItem}</p>
                </div>
              </div>

              <div className={styles.metricCard}>
                <Calendar size={32} />
                <div>
                  <h3>Efficiency</h3>
                  <p className={styles.value}>{reportData.efficiency}%</p>
                </div>
              </div>
            </div>

            <div className={styles.charts}>
              <div className={styles.chartPlaceholder}>
                <p>Sales Chart Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Reports;