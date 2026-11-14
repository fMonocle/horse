import { Empty, Timeline } from "antd";
import { Link } from "react-router-dom";
import { formatShort } from "../dates";
import type { HistoryEvent, HistoryKind } from "../types";

const kindColor: Record<HistoryKind, string> = {
  routine: "blue",
  report: "gray",
  incident: "red",
  docs: "gold",
  evaluation: "green",
  closed: "gray",
  consent: "purple",
};

export function HistoryTimeline({
  events,
  linkIncidents = false,
}: {
  events: HistoryEvent[];
  linkIncidents?: boolean;
}) {
  if (events.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Todavía no hay movimientos." />;
  }
  return (
    <Timeline
      className="history-timeline"
      items={events.map((event) => ({
        key: event.id,
        color: kindColor[event.kind],
        children: (
          <div className="history-item">
            <b>
              {linkIncidents && event.incidentId ? (
                <Link to={`/app/incidencias/${event.incidentId}`}>{event.title}</Link>
              ) : (
                event.title
              )}
            </b>
            <span>{event.detail}</span>
            <small>
              {formatShort(event.date)} · {event.actor}
            </small>
          </div>
        ),
      }))}
    />
  );
}
