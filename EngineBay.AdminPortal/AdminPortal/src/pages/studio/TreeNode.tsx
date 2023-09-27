import { TreeItem } from "@mui/x-tree-view/TreeItem";

export type TreeDataNode = {
  nodeId: string;
  label: string;
  children?: TreeDataNode[];
};

export type TreeNodeProps = {
  nodes: TreeDataNode[];
};

export const TreeNode = (props: TreeNodeProps) => {
  const { nodes } = props;
  return (
    <>
      {nodes.map((node) => {
        return (
          <TreeItem key={node.nodeId} nodeId={node.nodeId} label={node.label}>
            {node.children && <TreeNode nodes={node.children} />}
          </TreeItem>
        );
      })}
    </>
  );
};
