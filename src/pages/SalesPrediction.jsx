import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Button from '../components/common/Button';
import { TrendingUp, BarChart3, Calendar } from 'lucide-react';
import styles from './SalesPrediction.module.css';

/**
 * Sales prediction page
 */
const SalesPrediction = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPredictionData({
      predictedSales: 1250,
      confidence: 85,
      recommendations: [
        'Increase tomato stock by 20%',
        'Prepare extra pasta for dinner service'
      ]
    });
    
    setIsLoading(false);
  };

  return (
    <Layout isInternal={true}>
      <main className={styles.predictionPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Sales Prediction</h1>
            <p className={styles.subtitle}>
              Generate intelligent sales forecasts for your restaurant
            </p>
          </div>

          <div className={styles.content}>
            <div className={styles.controls}>
              <div className={styles.filters}>
                <div className={styles.filterGroup}>
                  <label>Time Period</label>
                  <select className={styles.select}>
                    <option>Next 7 days</option>
                    <option>Next 30 days</option>
                  </select>
                </div>
                
                <div className={styles.filterGroup}>
                  <label>Menu Item</label>
                  <select className={styles.select}>
                    <option>All items</option>
                    <option>Pizza Margherita</option>
                    <option>Pasta Carbonara</option>
                  </select>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="large"
                onClick={handleGeneratePrediction}
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Generate Prediction'}
              </Button>
            </div>

            {predictionData && (
              <div className={styles.results}>
                <div className={styles.resultCard}>
                  <TrendingUp size={32} />
                  <div>
                    <h3>Predicted Sales</h3>
                    <p className={styles.value}>${predictionData.predictedSales}</p>
                  </div>
                </div>

                <div className={styles.resultCard}>
                  <BarChart3 size={32} />
                  <div>
                    <h3>Confidence Level</h3>
                    <p className={styles.value}>{predictionData.confidence}%</p>
                  </div>
                </div>

                <div className={styles.recommendations}>
                  <h3>Recommendations</h3>
                  <ul>
                    {predictionData.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SalesPrediction;