import TreeNode from './tree';

export interface EditorStateProps {
  // Data of the current node
  node: TreeNode;
  // Contents of the current node
  // These are loaded internally from ID
  content: string;
}

export type EditorContextType = {
  // State
  state: EditorStateProps | null;
  // State transformations
  // Load a node and its contents in the editor
  loadNode: (node: TreeNode) => void;
};