import { TreeNode } from '../models/TreeNode';
import { ITreeNodeHandler } from '../interfaces/ITreeNodeHandler';
import { ITreeWalker } from '../interfaces/ITreeWalker';

export class TreeWalker<THandler extends ITreeNodeHandler<TreeNode>, TNode extends TreeNode> implements ITreeWalker<THandler, TNode> {
  private nodes: TNode[] = [];
  private nodeMap: Map<number, TNode> = new Map();

  async init(nodes: TNode[]): Promise<void> {
    this.nodes = nodes;
    this.nodeMap = new Map(nodes.map(node => [node.id, node]));
  }

  async reverseWalk(handler: THandler): Promise<void> {
    const childrenMap = new Map<number, TNode[]>();

    // Группируем детей по родителям
    this.nodes.forEach(node => {
      if (node.parentId !== null) {
        if (!childrenMap.has(node.parentId)) {
          childrenMap.set(node.parentId, []);
        }

        childrenMap.get(node.parentId)!.push(node);
      }
    });

    // Рекурсивно обходим дерево и вызываем обработчик узлов
    const visitNode = async (node: TNode) => {
      const children = childrenMap.get(node.id) || [];

      for (const child of children) {
        await visitNode(child);
      }

      const parent = this.nodeMap.get(node.parentId || -1) || null;

      await handler.handleNode(node, parent || undefined);
    };

    // Обход дерева с корневых узлов
    for (const rootNode of this.nodes.filter(node => !node.parentId)) {
      await visitNode(rootNode);
    }
  }
}
