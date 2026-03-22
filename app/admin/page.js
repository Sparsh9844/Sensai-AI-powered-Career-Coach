"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShieldCheck, Users, UserCheck, UserPlus, Trash2,
  RefreshCw, AlertCircle, Search, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin");
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to load admin data");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin?id=${userId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast({ title: `✅ ${userName} deleted successfully.` });
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== userId),
        stats: {
          ...prev.stats,
          total: prev.stats.total - 1,
          users: prev.stats.users - (prev.users.find((u) => u.id === userId)?.role === "USER" ? 1 : 0),
          admins: prev.stats.admins - (prev.users.find((u) => u.id === userId)?.role === "ADMIN" ? 1 : 0),
        },
      }));
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = data?.users?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const STAT_CARDS = data ? [
    { icon: Users,     label: "Total Users",    value: data.stats.total,       color: "246,80%,60%"  },
    { icon: UserCheck, label: "Regular Users",  value: data.stats.users,       color: "173,80%,40%"  },
    { icon: ShieldCheck,label: "Admins",        value: data.stats.admins,      color: "280,75%,60%"  },
    { icon: UserPlus,  label: "Joined Today",   value: data.stats.todaySignups, color: "32,95%,50%"  },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <PageHeader icon={ShieldCheck} title="Admin Panel" description="Manage all registered users and monitor platform activity." color="246,80%,60%" />

      <div className="p-8 space-y-8 max-w-7xl">
        {/* Stats */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ icon: Icon, label, value, color }) => (
              <Card key={label} className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `hsl(${color} / 0.1)` }}>
                      <Icon className="w-4.5 h-4.5" style={{ color: `hsl(${color})` }} />
                    </div>
                  </div>
                  <p className="text-3xl font-extrabold text-foreground leading-none">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">{label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-indigo-500" />
                All Users
                {data && <span className="text-xs font-normal text-muted-foreground ml-1">({filtered.length} shown)</span>}
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-9 w-48 text-sm"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 mb-4">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <div><p className="font-semibold text-sm">Failed to load users</p><p className="text-sm opacity-80 mt-0.5">{error}</p></div>
              </div>
            )}

            {loading && <TableSkeleton rows={6} />}

            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-3 pr-4">User</th>
                      <th className="text-left pb-3 pr-4">Email</th>
                      <th className="text-left pb-3 pr-4">Role</th>
                      <th className="text-left pb-3 pr-4">Joined</th>
                      <th className="text-right pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                          {search ? "No users match your search." : "No users found."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((user) => (
                        <tr key={user.id}>
                          <td className="pr-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                              </div>
                              <span className="font-semibold text-foreground text-sm">{user.name}</span>
                            </div>
                          </td>
                          <td className="pr-4 text-muted-foreground">{user.email}</td>
                          <td className="pr-4">
                            <Badge variant={user.role === "ADMIN" ? "admin" : "user"}>
                              {user.role === "ADMIN" ? "Admin" : "User"}
                            </Badge>
                          </td>
                          <td className="pr-4">
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Calendar className="w-3 h-3" />
                              {formatDate(user.createdAt)}
                            </div>
                          </td>
                          <td className="text-right">
                            <Button variant="ghost" size="icon"
                              disabled={deletingId === user.id}
                              onClick={() => handleDelete(user.id, user.name)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50">
                              {deletingId === user.id
                                ? <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
