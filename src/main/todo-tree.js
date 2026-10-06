'use strict';
// Children belong to one parent; old flat task records remain valid.
function children(todo) { return Array.isArray(todo.subtasks) ? todo.subtasks : []; }
function parentDone(todo) { const list = children(todo); return list.length ? list.every(t => t.done) : !!todo.done; }
function reorder(todos, ids) {
  if (!Array.isArray(ids)) return todos;
  const active = new Map(todos.filter(t => !t.archivedAt).map(t => [t.id, t]));
  const ordered = [];
  for (const id of ids) if (active.has(id)) { ordered.push(active.get(id)); active.delete(id); }
  return [...ordered, ...active.values(), ...todos.filter(t => t.archivedAt)];
}
module.exports = { children, parentDone, reorder };
