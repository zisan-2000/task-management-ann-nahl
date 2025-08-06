"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function RolePermissionPage() {
  const { user } = useAuth();
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  // Load roles & permissions
  useEffect(() => {
    fetch("/api/roles")
      .then((res) => res.json())
      .then((data) => setRoles(data.data));
    fetch("/api/permissions")
      .then((res) => res.json())
      .then((data) => setPermissions(data.data));
  }, []);

  const loadRolePermissions = async (roleId: string) => {
    const res = await fetch(`/api/role-permissions/${roleId}`);
    const data = await res.json();
    setSelectedRole({
      id: roleId,
      permissions: data.permissions.map((p: any) => p.id),
    });
  };

  const togglePermission = async (permissionId: string, checked: boolean) => {
    if (!selectedRole) return;

    if (checked) {
      // Assign
      await fetch("/api/role-permissions", {
        method: "POST",
        body: JSON.stringify({ roleId: selectedRole.id, permissionId }),
      });
    } else {
      // Remove
      await fetch(`/api/role-permissions/${selectedRole.id}`, {
        method: "DELETE",
        body: JSON.stringify({ permissionId }),
      });
    }
    loadRolePermissions(selectedRole.id);
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Role List */}
      <div className="w-1/3 border rounded p-4">
        <h2 className="font-bold mb-4">Roles</h2>
        <ul>
          {roles.map((role) => (
            <li key={role.id}>
              <button
                className={`block w-full text-left p-2 rounded ${
                  selectedRole?.id === role.id ? "bg-blue-100" : ""
                }`}
                onClick={() => loadRolePermissions(role.id)}
              >
                {role.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Permission List */}
      <div className="w-2/3 border rounded p-4">
        <h2 className="font-bold mb-4">Permissions</h2>
        {!selectedRole && <p>Select a role to manage permissions</p>}
        {selectedRole && (
          <div className="space-y-2">
            {permissions.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRole.permissions.includes(p.id)}
                  onChange={(e) => togglePermission(p.id, e.target.checked)}
                />
                {p.name}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
