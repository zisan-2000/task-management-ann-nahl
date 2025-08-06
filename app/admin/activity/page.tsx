"use client";

import { useEffect, useState, useMemo } from "react";

type Log = {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  timestamp: string;
  details: any;
  user?: { id: string; name: string | null; email: string };
};

export default function ActivityPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // filter by action
      if (actionFilter !== "all" && log.action !== actionFilter) return false;

      // search filter (user name/email, entityType, entityId, action)
      const searchText = search.toLowerCase();
      return (
        (log.user?.name?.toLowerCase().includes(searchText) ?? false) ||
        (log.user?.email?.toLowerCase().includes(searchText) ?? false) ||
        log.entityType.toLowerCase().includes(searchText) ||
        log.entityId.toLowerCase().includes(searchText) ||
        log.action.toLowerCase().includes(searchText)
      );
    });
  }, [logs, search, actionFilter]);

  if (loading) return <div className="p-6">Loading logs...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Activity Logs</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Search by user, entity, or action..."
          className="border rounded px-3 py-2 w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 w-full sm:w-40"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="all">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Entity</th>
              <th className="p-3">Action</th>
              <th className="p-3">Details</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-500">
                  No matching logs found
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b hover:bg-gray-50 align-top"
                >
                  <td className="p-3">
                    {log.user?.name || "Unknown"} <br />
                    <span className="text-xs text-gray-500">
                      {log.user?.email}
                    </span>
                  </td>
                  <td className="p-3">
                    {log.entityType} <br />
                    <span className="text-xs text-gray-500">
                      {log.entityId}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        log.action === "create"
                          ? "bg-green-100 text-green-700"
                          : log.action === "update"
                          ? "bg-blue-100 text-blue-700"
                          : log.action === "delete"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 max-w-[300px]">
                    {log.details && typeof log.details === "object" ? (
                      <table className="text-xs border border-gray-200 rounded w-full">
                        <tbody>
                          {Object.entries(log.details).map(([key, value]) => (
                            <tr key={key} className="border-b last:border-0">
                              <td className="px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                                {key}
                              </td>
                              <td className="px-2 py-1 text-gray-600 break-words">
                                {typeof value === "object"
                                  ? JSON.stringify(value, null, 2)
                                  : String(value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
