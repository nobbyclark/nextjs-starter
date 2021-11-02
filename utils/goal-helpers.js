export const transformGoals = ({
  id,
  name,
  childGoals,
  parentGoal,
  owners,
}) => ({
  id,
  shortId: id.substr(5, 8),
  name: name ? name : id.substr(5, 8),
  children: childGoals ? childGoals.data.map(transformGoals) : null,
  numChildren: childGoals?.data?.length || 0,
  parentGoal: parentGoal ? transformGoals(parentGoal) : null,
  owners: owners ? owners?.data : null,
});

export const removeChildren = (parent) => {
  parent.children = parent.children.map(({ children, ...rest }) => ({
    ...rest,
    numChildren: children.length,
  }));

  return parent;
};

export const searchTree = (node, match) => {
  if (node.id == match) {
    return node;
  } else if (node.children) {
    let i;
    let result = null;
    for (i = 0; result == null && i < node.children.length; i++) {
      result = searchTree(node.children[i], match);
    }
    return result;
  }
  return null;
};
