import React from "react";
import Avatar from "@/components/atoms/Avatar";
import RoleBadge from "@/components/molecules/RoleBadge";

const UserCard = ({ user, showRole = true }) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={user.avatar} alt={user.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 truncate">{user.email}</p>
      </div>
      {showRole && <RoleBadge role={user.role} />}
    </div>
  );
};

export default UserCard;