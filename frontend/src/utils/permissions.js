// utilities to check what to render
export const isAdmin = user => user && user.role === "admin";
export const isCollab = user => user && user.role === "collab";
export const isViewer = user => user && user.role === "viewer";

export function canEditProject(user, project) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  // collab can edit if is member (project.members contains user id)
  if (isCollab(user)) {
    return (project.members || []).some(m => m.id === user.id);
  }
  return false;
}

export function canDeleteProject(user, project) {
  // same logic in your backend: admin or membership role == admin (you said changed to admin)
  return isAdmin(user) || canEditProject(user, project);
}

export function canCreateTask(user, project) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isCollab(user)) return (project.members || []).some(m => m.id === user.id);
  return false;
}

export function canViewTaskDetail(user, task) {
  // per your rule: collaborator CANNOT view a single task detail
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isCollab(user)) return false; // explicit: collab cannot view single task
  // viewer: can view only if assigned
  if (isViewer(user)) return task.assigned_to && task.assigned_to.id === user.id;
  return false;
}

export function canComment(user, task) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  // collab: only if assigned
  if (isCollab(user)) return task.assigned_to && task.assigned_to.id === user.id;
  // viewer: only if assigned
  if (isViewer(user)) return task.assigned_to && task.assigned_to.id === user.id;
  return false;
}
