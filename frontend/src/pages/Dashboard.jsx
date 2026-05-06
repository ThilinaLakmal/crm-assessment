/**
 * ============================================
 * Dashboard Page
 * ============================================
 * Fetches aggregated stats from /api/dashboard and recent leads from /api/leads.
 * Renders a fully packed, professional UI with:
 * - Animated greeting
 * - Staggered stat cards
 * - Pipeline distribution chart (Recharts)
 * - Recent leads table
 */

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table, Badge, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Link } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineThumbUp,
  HiOutlineThumbDown,
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
  HiOutlineArrowRight
} from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

/**
 * Stat card configuration
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

const STATUS_BADGE = {
  New:            { bg: 'primary',   label: 'New' },
  Contacted:      { bg: 'info',      label: 'Contacted' },
  Qualified:      { bg: 'warning',   label: 'Qualified' },
  'Proposal Sent':{ bg: 'secondary', label: 'Proposal Sent' },
  Won:            { bg: 'success',   label: 'Won' },
  Lost:           { bg: 'danger',    label: 'Lost' },
};

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

// ---- Framer Motion Variants ----
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, leadsRes] = await Promise.all([
          api.get('/dashboard'),
          api.get('/leads')
        ]);
        setStats(statsRes.data.data);
        // Take the 5 most recent leads for the table
        setRecentLeads(leadsRes.data.data.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted-custom">Loading your workspace...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  // Data for the Pipeline Chart
  const chartData = [
    { name: 'New', value: stats.newLeads, color: '#3b82f6' },
    { name: 'Contacted', value: stats.contactedLeads || 0, color: '#0ea5e9' },
    { name: 'Qualified', value: stats.qualifiedLeads, color: '#f59e0b' },
    { name: 'Proposal', value: stats.proposalSentLeads || 0, color: '#8b5cf6' },
    { name: 'Won', value: stats.wonLeads, color: '#10b981' },
    { name: 'Lost', value: stats.lostLeads, color: '#ef4444' }
  ];

  return (
    <Container fluid className="px-4 py-4">
      {/* ---- Welcome Header ---- */}
      <motion.div 
        className="page-header mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="page-title">Welcome back, {user?.email.split('@')[0]}! 👋</h1>
        <p className="page-subtitle">Here is what's happening with your sales pipeline today.</p>
      </motion.div>

      {/* ---- Stat Cards Grid ---- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Row className="g-3 mb-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Col key={card.key} xs={12} sm={6} lg={4} xl={3}>
                <motion.div variants={itemVariants}>
                  <Card className="stat-card h-100">
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
                </motion.div>
              </Col>
            );
          })}
        </Row>
      </motion.div>

      {/* ---- Main Dashboard Content (Chart & Table) ---- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <Row className="g-4">
          
          {/* Pipeline Chart */}
          <Col xs={12} xl={6}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <Card className="detail-card h-100">
                <div className="detail-card-header d-flex justify-content-between align-items-center">
                  <span>Pipeline Distribution</span>
                </div>
                <Card.Body style={{ height: '350px', padding: '1rem 1rem 0 0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--gray-400)', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--gray-400)', fontSize: 12 }}
                      />
                      <Tooltip 
                        cursor={{ fill: 'var(--table-hover-bg)' }}
                        contentStyle={{ 
                          backgroundColor: 'var(--surface-card)', 
                          borderColor: 'var(--border-color)',
                          borderRadius: '8px',
                          color: 'var(--text-heading)'
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Recent Leads Table */}
          <Col xs={12} xl={6}>
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <Card className="detail-card h-100">
                <div className="detail-card-header d-flex justify-content-between align-items-center">
                  <span>Recent Leads</span>
                  <Button 
                    as={Link} 
                    to="/leads" 
                    variant="link" 
                    className="p-0 text-decoration-none"
                    style={{ fontSize: '0.85rem', color: 'var(--primary-400)' }}
                  >
                    View All <HiOutlineArrowRight />
                  </Button>
                </div>
                <div className="table-responsive">
                  <Table className="leads-table mb-0" hover>
                    <thead>
                      <tr>
                        <th>Lead Name</th>
                        <th>Status</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeads.map((lead) => (
                        <tr key={lead.id}>
                          <td>
                            <Link to={`/leads/${lead.id}`} className="text-decoration-none fw-medium">
                              {lead.lead_name}
                            </Link>
                            <div className="text-muted-custom" style={{ fontSize: '0.75rem' }}>
                              {lead.company_name || 'No Company'}
                            </div>
                          </td>
                          <td>
                            <Badge
                              bg={STATUS_BADGE[lead.status]?.bg || 'secondary'}
                              className="status-badge"
                            >
                              {STATUS_BADGE[lead.status]?.label || lead.status}
                            </Badge>
                          </td>
                          <td className="text-muted-custom">
                            {formatValue(lead.estimated_deal_value, true)}
                          </td>
                        </tr>
                      ))}
                      {recentLeads.length === 0 && (
                        <tr>
                          <td colSpan="3" className="text-center py-4 text-muted-custom">
                            No leads found. Get started by adding one!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </motion.div>
          </Col>

        </Row>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
