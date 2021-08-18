import { SyncBlockData } from '../Editor/Components/SyncBlock';
import { ComboText, NodeEditorContent } from '../Editor/Store/Types';

export interface NodeContent {
  type: string;
  content: NodeEditorContent;
}

export interface FileData {
  ilinks: ComboText[];
  tags: ComboText[];
  contents: {
    [key: string]: NodeContent;
  };
  syncBlocks: SyncBlockData[];
}