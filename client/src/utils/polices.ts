import { Project, TeamMember } from "../types";

export const isManager = (
  managerId: Project["manager"],
  userId: TeamMember["_id"]
): boolean => {
  return managerId === userId;
};
