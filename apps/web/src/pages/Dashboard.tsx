import { demoOutcomes, demoTopics } from "../data/demoCurriculum";
import type { MasteryRecord } from "../types/curriculum";

interface DashboardProps {
  masteryRecords: Record<string, MasteryRecord>;
  onRetakeTest: () => void;
}

const statusColor: Record<string, string> = {
  zayif: "#e5484d",
  orta: "#f5a623",
  iyi: "#3dd68c",
  tam: "#2b8a3e",
};

const statusLabel: Record<string, string> = {
  zayif: "Zayıf",
  orta: "Orta",
  iyi: "İyi",
  tam: "Tam Öğrenildi",
};

export function Dashboard({ masteryRecords, onRetakeTest }: DashboardProps) {
  const hasAnyRecord = Object.keys(masteryRecords).length > 0;

  return (
    <div className="card">
      <h2>Kazanım Durumu</h2>
      {!hasAnyRecord && (
        <p>Henüz diagnostik test tamamlanmadı. Sonuçlar burada görünecek.</p>
      )}
      <div className="outcome-list">
        {demoOutcomes.map((outcome) => {
          const topic = demoTopics.find((t) => t.id === outcome.topicId);
          const record = masteryRecords[outcome.id];
          return (
            <div key={outcome.id} className="outcome-row">
              <div>
                <strong>{topic?.name}</strong>
                <p className="outcome-desc">{outcome.description}</p>
              </div>
              <div className="mastery-badge" style={{ background: record ? statusColor[record.status] : "#ccc" }}>
                {record ? `${statusLabel[record.status]} (${record.level})` : "Ölçülmedi"}
              </div>
            </div>
          );
        })}
      </div>
      <button className="primary" onClick={onRetakeTest} style={{ marginTop: 16 }}>
        Testi Tekrar Çöz
      </button>
    </div>
  );
}
