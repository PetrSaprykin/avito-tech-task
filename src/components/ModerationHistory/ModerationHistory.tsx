import { Timeline, Card } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ModerationHistory as ModerationHistoryType } from "@/types";
import styles from "./ModerationHistory.module.css";

interface ModerationHistoryProps {
  history: ModerationHistoryType[];
}

export const ModerationHistory = ({ history }: ModerationHistoryProps) => {
  const getActionConfig = (action: string) => {
    switch (action) {
      case "approved":
        return {
          color: "green",
          text: "Одобрено",
          icon: <CheckCircleOutlined />,
        };
      case "rejected":
        return {
          color: "red",
          text: "Отклонено",
          icon: <CloseCircleOutlined />,
        };
      case "requestChanges":
        return {
          color: "orange",
          text: "Запрошены изменения",
          icon: <ExclamationCircleOutlined />,
        };
      default:
        return { color: "default", text: action, icon: null };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!history || history.length === 0) {
    return (
      <Card title="История модерации">
        <p className={styles.empty}>История пуста</p>
      </Card>
    );
  }

  return (
    <Card title="История модерации">
      <Timeline
        items={history.map((item) => {
          const config = getActionConfig(item.action);
          return {
            color: config.color,
            dot: config.icon,
            children: (
              <div>
                <div className={styles.action}>
                  <strong>{config.text}</strong>
                </div>
                <div className={styles.moderator}>
                  Модератор: {item.moderatorName}
                </div>
                <div className={styles.date}>{formatDate(item.timestamp)}</div>
                {item.reason && (
                  <div className={styles.reason}>Причина: {item.reason}</div>
                )}
                {item.comment && (
                  <div className={styles.comment}>{item.comment}</div>
                )}
              </div>
            ),
          };
        })}
      />
    </Card>
  );
};
