import { TreeData } from './data/TreeData'
import { ITreeWalker } from './interfaces/ITreeWalker'
import { ITreeNodeHandler } from './interfaces/ITreeNodeHandler'
import { TreeNode } from './models/TreeNode'
import { TreeWalker } from './implementations/TreeWalker'
import { TreeNodeHandler } from './implementations/TreeNodeHandler'

function printTree(nodes: TreeNode[], parentId: number | null = null, level: number = 0): void {
  const children = parentId ? nodes.filter(node => node.parentId === parentId) : nodes.filter(node =>!node.parentId);

  for (const node of children) {
    const indent = '|  '.repeat(level)
    console.log(`${indent}Node ${node.id} - condition: ${node.addValueCondition}, value: ${node.value}, valueToParent: ${node.valueToParent}`)

    printTree(nodes, node.id, level + 1)
  }
}

async function run(): Promise<void> {
    const data = TreeData.getData<TreeNode<number>>()

    printTree(data)

    const walker: ITreeWalker<TreeNodeHandler, TreeNode<number>> = new TreeWalker<TreeNodeHandler, TreeNode<number>>() // TODO ITreeWalker Implementation
    await walker.init(data)
    const nodeHandler: ITreeNodeHandler<TreeNode<number>> = new TreeNodeHandler() // TODO ITreeNodeHandler Implementation
    await walker.reverseWalk(nodeHandler)

    console.log('\n\n')
    console.log('After reverse walk: ')
    printTree(data);
}

run().catch(err => {
    console.log(err)
})
