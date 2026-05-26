import { Badge } from "@/components/admin/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";

export type LeadMessageRow = {
  id: string;
  direction: string;
  channel: string;
  subject: string | null;
  body: string;
  to_email: string | null;
  from_email: string | null;
  provider: string;
  created_at: string;
};

export function LeadThread({ messages }: { messages: LeadMessageRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation</CardTitle>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-[12px] text-admin-fg-subtle">No messages yet. Send a reply or add an internal note.</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-admin-border-soft bg-admin-elevated p-3 text-[13px]"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge tone={m.direction === "outbound" ? "accent" : m.direction === "note" ? "warning" : "neutral"}>
                    {m.direction}
                  </Badge>
                  {m.subject ? <span className="font-medium text-admin-fg">{m.subject}</span> : null}
                  <span className="ml-auto text-[11px] text-admin-fg-subtle">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-admin-fg-muted">{m.body}</p>
                {m.direction === "outbound" ? (
                  <p className="mt-1 text-[11px] text-admin-fg-subtle">
                    via {m.provider}
                    {m.to_email ? ` → ${m.to_email}` : ""}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
