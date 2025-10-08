import React from "react";
import Badge from "@/components/atoms/Badge";

const RoleBadge = ({ role }) => {
  const roleConfig = {
    admin: { variant: "admin", label: "Admin" },
    project_manager: { variant: "manager", label: "Project Manager" },
    member: { variant: "member", label: "Member" },
  };

  const config = roleConfig[role];
  if (!config) return null;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default RoleBadge;