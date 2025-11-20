import { useState, useEffect } from "react";
import { Card, Select, Row, Col, Spin } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getStatsSummary,
  getActivityChart,
  getDecisionsChart,
  getCategoriesChart,
} from "@/api/stats";
import { StatsSummary } from "@/types";
import StatCard from "@/components/StatCard/StatCard";
import ActivityChart from "@/components/charts/ActivityChart";
import DecisionsChart from "@/components/charts/DecisionsChart";
import CategoriesChart from "@/components/charts/CategoriesChart";
import styles from "./StatsPage.module.css";

export const StatsPage = () => {
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [activityData, setActivityData] = useState([]);
  const [decisionsData, setDecisionsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState({});

  useEffect(() => {
    loadAllStats();
  }, [period]);

  const loadAllStats = async () => {
    setLoading(true);
    try {
      const [summary, activity, decisions, categories] = await Promise.all([
        getStatsSummary(period),
        getActivityChart(period),
        getDecisionsChart(period),
        getCategoriesChart(period),
      ]);

      setStats(summary);
      setActivityData(activity);
      setDecisionsData(decisions);
      setCategoriesData(categories);
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { label: "Сегодня", value: "today" },
    { label: "Последние 7 дней", value: "week" },
    { label: "Последние 30 дней", value: "month" },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Статистика модератора</h1>
        <Select
          value={period}
          onChange={setPeriod}
          options={periodOptions}
          style={{ width: 200 }}
        />
      </div>

      {stats && (
        <>
          <Row gutter={[16, 16]} className={styles.statsCards}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Проверено"
                value={stats.totalReviewed}
                icon={<CheckCircleOutlined />}
                color="#1890ff"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Одобрено"
                value={`${stats.approvedPercentage.toFixed(2)}%`}
                icon={<CheckCircleOutlined />}
                color="#52c41a"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Отклонено"
                value={`${stats.rejectedPercentage.toFixed(2)}%`}
                icon={<CloseCircleOutlined />}
                color="#ff4d4f"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard
                title="Ср. время"
                value={`${Math.round(stats.averageReviewTime / 3600)} ч.`}
                icon={<ClockCircleOutlined />}
                color="#faad14"
              />
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={16}>
              <Card title="График активности" className={styles.chartCard}>
                <ActivityChart data={activityData} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Распределение решений" className={styles.chartCard}>
                <DecisionsChart data={decisionsData} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24}>
              <Card title="Категории объявлений" className={styles.chartCard}>
                <CategoriesChart data={categoriesData} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
