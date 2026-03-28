interface Report {
  id: string;
  date: string;
  content: string;
}

export default function ViewText({ reports }: { reports: Report[] }) {
  if (!reports.length) return <p className="text-gray-400 text-sm">No reports yet.</p>;

  return (
    <div className="space-y-4">
      {reports.map((r) => (
        <div key={r.id} className="rounded-xl border bg-white p-4">
          <p className="text-xs text-gray-400 mb-2">{r.date}</p>
          <p className="text-sm text-black whitespace-pre-wrap">{r.content}</p>
        </div>
      ))}
    </div>
  );
}
