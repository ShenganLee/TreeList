import { TreeList, TreeData } from "../src/index";

const data: TreeData[] = [{
    name: '1.1',
    node: [{
        name: '2.1',
        node: [{
            name: '3.1',
        }]
    }, {
        name: '2.2',
        node: [{
            name: '3.2',
            node: [{
                name: '4.1',
            }]
        }]
    }, {
        name: '2.3',
    }]
}, {
    name: '1.2',
    node: [{
        name: '2.4',
        node: [{
            name: '3.3',
        },{
            name: '3.4',
        }]
    }]
}]

// test("filter1", () => {
//     const trees = new TreeList(data, (d) => d.node as TreeData[])
//     const ts = trees.filter((d) => (d.name as string ).includes('.'))

//     expect(JSON.stringify(ts.treeData('children'))).toBe(JSON.stringify(trees.treeData('children')));
// });

test("filter2", () => {
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
    expect(JSON.stringify(ts.treeData('node'))).toBe(JSON.stringify(v));
});
