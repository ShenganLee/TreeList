import BaseTree from "./BaseTree";
import TreeNode, { TreeData, ChildrenHandler } from "./TreeNode"

const defaultChildrenKey = 'children'
const symbolChildrenKey = Symbol('children')

const newTreeListWithTreeNodes = (treeNodes: TreeNode[]): TreeList => {
    treeNodes.sort((a, b) => b.deep - a.deep)

    treeNodes.sort((a, b) => b.deep === a.deep ? a.index - b.index : 0)

    const treeNodeSet = new Set(treeNodes)

    const treeDataMap: Map<TreeNode, TreeData> = new Map()

    treeNodeSet.forEach(node => {
        treeDataMap.set(node, { ...node.data, [symbolChildrenKey]: [] })
    })

    const treeDataList: TreeData[] = []

    treeNodeSet.forEach(node => {
        if (node.parent) {
            const nodeData = treeDataMap.get(node);
            const parentData = treeDataMap.get(node.parent);

            if (parentData) {
                const children: TreeData[] = parentData?.[symbolChildrenKey] as TreeData[] ?? [];
                children.push(nodeData as TreeData);
                return
            }
        }

        treeDataList.push(treeDataMap.get(node) as TreeData);
    })

    return new TreeList(treeDataList, (treeData: TreeData) => {
        const children = treeData[symbolChildrenKey]
        Reflect.deleteProperty(treeData, symbolChildrenKey)
        return children as TreeData[]
    })
}

export default class TreeList extends BaseTree<TreeNode> {

    static TreeNode = TreeNode;

    readonly data: TreeData[];

    constructor(data: TreeData[], childrenHandler?: ChildrenHandler) {
        const nodes = data.map((data, index) => new TreeNode(null, data, index, 0, childrenHandler));
        super(nodes);
        this.data = data;
    }

    get DeepData(): TreeData[] {
        return this.deepNodes.map(node => node.data)
    }

    forEach(fn: (value: TreeData, node: TreeNode) => void, deep = true): void {
        (deep ? this.deepNodes : this.nodes).forEach(node => fn(node.data, node))
    }

    some(fn: (value: TreeData, node: TreeNode) => unknown, deep = true): boolean {
        return (deep ? this.deepNodes : this.nodes).some(node => fn(node.data, node))
    }

    every(fn: (value: TreeData, node: TreeNode) => unknown, deep = true): boolean {
        return (deep ? this.deepNodes : this.nodes).every(node => fn(node.data, node))
    }

    filter(fn: (value: TreeData, node: TreeNode) => unknown, withParent = true, deep = true): TreeList {
        const nodes: TreeNode[] = (deep ? this.deepNodes : this.nodes).filter(node => fn(node.data, node));

        const treeNodes = [...nodes]

        withParent && nodes.forEach((node => {
            treeNodes.unshift(...node.parents)
        }))

        return newTreeListWithTreeNodes(treeNodes)
    }

    find(fn: (value: TreeData, node: TreeNode) => unknown, withParent = true, deep = true): TreeList {
        const node = (deep ? this.deepNodes : this.nodes).find(node => fn(node.data, node))

        if (!node) return new TreeList([])

        const treeNodes = [node]
        withParent && treeNodes.unshift(...node.parents)

        return newTreeListWithTreeNodes(treeNodes)
    }

    map(fn: (value: TreeData, node: TreeNode) => TreeData, childrenKey: string | symbol | number = symbolChildrenKey, deep = true): TreeList {
        const data = this.nodes.map(node => {
            if (deep) return node.treeData(childrenKey, fn)

            const treeData = fn(node.data, node)
            return { ...treeData, childrenKey: [] }
        })

        return new TreeList(data, (treeData: TreeData) => {
            const children = treeData[childrenKey]
            if (childrenKey === symbolChildrenKey) Reflect.deleteProperty(treeData, childrenKey)
            return children as TreeData[]
        })
    }

    treeData(childrenKey: string | symbol | number = defaultChildrenKey): TreeData[] {
        return this.nodes.map(node => node.treeData(childrenKey))
    }
}