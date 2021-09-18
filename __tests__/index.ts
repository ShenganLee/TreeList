import { TreeList, TreeData } from "../src/index";

const data: TreeData[] = [{
    name: '1.1',
    node: [{
        name: '2.1',
        node: [{
            name: '3.1',
            node: []
        }]
    }, {
        name: '2.2',
        node: [{
            name: '3.2',
            node: [{
                name: '4.1',
                node: []
            }]
        }]
    }, {
        name: '2.3',
        node: []
    }]
}, {
    name: '1.2',
    node: [{
        name: '2.4',
        node: [{
            name: '3.3',
            node: []
        },{
            name: '3.4',
            node: []
        }]
    }]
}]

test("forEach", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])

    let i = 0
    trees.forEach(() => i++)

    expect(i).toBe(trees.deepSize);
});

test("some", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])

    expect(trees.some((d) => d.name === '5.1')).toBe(false);
});

test("every", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])

    expect(trees.every((d) => (d.name as string).includes('.'))).toBe(true);
});

test("find", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])
    const treeData = trees.find((d) => d.name === '3.4', false).treeData('node')
    expect(treeData).toEqual([{ name: '3.4', node: [] }]);
});

test("filter", () => {
    const v: TreeData[] = [{
        name: '1.1',
        node: [{
            name: '2.1',
            node: []
        }, {
            name: '2.2',
            node: [{
                name: '3.2',
                node: []
            }]
        }, {
            name: '2.3',
            node: []
        }]
    }, {
        name: '1.2',
        node: [{
            name: '2.4',
            node: []
        }]
    }]

    const trees = new TreeList(data, (d) => d.node as TreeData[])
    const ts = trees.filter((d) => (d.name as string ).includes('2')).map(d => ({ name: d.name }))

    // console.log(JSON.stringify(ts.treeData('node')))
    expect(ts.treeData('node')).toEqual(v);
});

test("map", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])
    const treeData = trees.map((d) => ({ name: d.name })).treeData('node')
    expect(treeData).toEqual(data);
});

test("treeData", () => {
    const trees = new TreeList(data, (d) => d.node as TreeData[])
    const treeData = trees.treeData('node')
    expect(treeData).toEqual(data);
});