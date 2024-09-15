type Permission = {
  value: string;
  label: string;
  children?: Permission[];
};
export function formatPermission(permissions: string[]): Permission[] {
  const result: Permission[] = [];

  permissions?.forEach((permission) => {
    const [parentValue, childValue, subChildValue] = permission.split(':');

    // Find or create the top-level parent
    let parent = result.find((item) => item.value === parentValue);
    if (!parent) {
      parent = { value: parentValue, label: parentValue, children: [] };
      result.push(parent);
    }

    // Find or create the child category under the parent
    let child = parent.children!.find((item) => item.value === childValue);
    if (!child) {
      child = { value: childValue, label: childValue, children: [] };
      parent.children!.push(child);
    }

    // Add the sub-category to the child if it exists
    if (subChildValue) {
      child.children!.push({ value: subChildValue, label: subChildValue });
    }
  });

  return result;
}
