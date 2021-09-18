import BaseTree from './BaseTree'


export type Date = Record<string, unknown>
export type TreeData = {
    [key: string | number | symbol]: TreeData[] | unknown;
};
export type ChildrenHandler = (treeData: TreeData) => TreeData[]
export default class TreeNode extends BaseTree<TreeNode> {

    readonly deep: number;
    readonly index: number;
    readonly data: TreeData;
    readonly parent: TreeNode | null;

    constructor(parent: TreeNode | null, data: TreeData, index: number, deep: number, childrenHandler?: ChildrenHandler) {
        const childrenDataList = typeof childrenHandler === 'function' ? ((childrenHandler as ChildrenHandler)(data) || []) : [];
        const nodes = childrenDataList.map((data, index) => {
            return new TreeNode(this, data, index, deep + 1, childrenHandler);
        })

        super(nodes)

        this.data = data;
        this.deep = deep;
        this.index = index;
        this.parent = parent;
    }

    get root(): TreeNode {
        let parent = this.parent

        if (!parent) return this

        while(parent.parent) {
            parent = parent.parent 
        }

        return parent 
    }

    get parents(): TreeNode[] {
        const parents = []

        let parent = this.parent

        while(parent) {
            parents.push(parent)
            parent = parent.parent
        }

        return parents
    }

    get parentSet(): Set<TreeNode> {
        return new Set(this.parents)
    }

    get deepData(): TreeData[] {
        return this.deepNodes.map(node => node.data)
    }

    treeData(childrenKey: string | symbol | number, fn?: (value: TreeData, node: TreeNode) => TreeData): TreeData {
        const children = this.nodes.map(node => node.treeData(childrenKey, fn))
        const data = typeof fn === 'function' ? fn(this.data, this) : this.data

        return { ...data, [childrenKey]: children }
    }
}