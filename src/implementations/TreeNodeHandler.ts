import { TreeNode } from '../models/TreeNode';
import { ITreeNodeHandler } from '../interfaces/ITreeNodeHandler';

export class TreeNodeHandler implements ITreeNodeHandler<TreeNode<number>> {
  async handleNode(node: TreeNode<number>, parent?: TreeNode<number>): Promise<void> {
    if (!parent) {
      return;
    }

    if (node.addValueCondition) {
      // Если для узла выполняется условие addValueCondition == true,
      // то в его value должна быть сумма значений valueToParent всех его детей
      node.value = node.value + (node.context ? node.context : 0);

      // Если для узла значение value было записано, то родителю должно быть отправлено
      // только значение valueToParent от текущего узла
      parent.context = (parent.context ? parent.context : 0) + node.valueToParent;
    } else {
       // Если для узла выполняется условие addValueCondition == false,
       // то все valueToParent его детей должны быть отправлены родителю, как и valueToParent самого узла
       parent.context = (parent.context ? parent.context : 0) + node.context + node.valueToParent;
    }
  }
}
