export default class BaseTree<T extends BaseTree<T>> {
    readonly nodes: Array<T>;

    constructor(nodes: Array<T>) {
        this.nodes = nodes
    }

    get nodeSet(): Set<T> {
        return new Set(this.nodes)
    }

    get deepNodes(): Array<T> {
        const deepNodes: Array<T> = []

        const queue = [...this.nodes]
        while (queue.length) {
            const node = queue.shift() as T

            deepNodes.push(node)
            queue.unshift(...node.nodes)
        }
        return deepNodes
    }

    get deepNodeSet(): Set<T> {
        return new Set(this.deepNodes)
    }

    get size(): number {
        return this.nodes.length;
    }

    get deepSize(): number {
        return this.deepNodes.length;
    }

    has(node: T, deep: boolean): boolean {
        return deep ? this.deepNodeSet.has(node) : this.nodeSet.has(node)
    }
}