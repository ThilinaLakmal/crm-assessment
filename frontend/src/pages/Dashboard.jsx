/**
 * ============================================
 * Dashboard Page
 * ============================================
 * Fetches aggregated stats from /api/dashboard
 * and renders them in a responsive card grid.
 */

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
} from 'react-icons/hi';
import api from '../services/api';

/**
 * Stat card configuration — maps API keys to display props.
 * This makes it trivial to add/remove cards later.
 */
const STAT_CARDS = [
  {
    key: 'totalLeads',
    label: 'Total Leads',
    icon: HiOutlineUsers,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    isCurrency: false,
  },
  {
    key: 'newLeads',
    label: 'New Leads',
    icon: HiOutlineSparkles,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    isCurrency: false,
  },
  {
    key: 'qualifiedLeads',
    label: 'Qualified',
    icon: HiOutlineBadgeCheck,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    isCurrency: false,
  },
  {
    key: 'wonLeads',
    label: 'Won Leads',
    icon: HiOutlineThumbUp,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #34d399)',
    isCurrency: false,
  },
  {
    key: 'lostLeads',
    label: 'Lost Leads',
    icon: HiOutlineThumbDown,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    isCurrency: false,
  },
  {
    key: 'totalEstimatedValue',
    label: 'Total Pipeline Value',
    icon: HiOutlineCurrencyDollar,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    isCurrency: true,
  },
  {
    key: 'wonDealsValue',
    label: 'Won Deals Value',
    icon: HiOutlineTrendingUp,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    isCurrency: true,
  },
];

/**
 * Format a number as currency or plain.
 */
const formatValue = (value, isCurrency) => {
  if (isCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return value?.toLocaleString() ?? '0';
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setStats(data.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ---- Loading State ----
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted-custom">Loading dashboard...</p>
      </Container>
    );
  }

  // ---- Error State ----
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="px-4 py-4">
      {/* ---- Page Header ---- */}
      <div className="page-header mb-4">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your lead pipeline</p>
      </div>

      {/* ---- Stat Cards Grid ---- */}
      <Row className="g-3">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Col key={card.key} xs={12} sm={6} lg={4} xl={3}>
              <Card className="stat-card">
                <Card.Body className="d-flex align-items-center gap-3">
                  <div
                    className="stat-icon-wrapper"
                    style={{ background: card.gradient }}
                  >
                    <Icon size={24} color="#fff" />
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">{card.label}</div>
                    <div className="stat-value">
                      {formatValue(stats?.[card.key] ?? 0, card.isCurrency)}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default Dashboard;
