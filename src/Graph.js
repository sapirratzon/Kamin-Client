import {Component} from "react";
import React from "react";
import {Graph} from "react-d3-graph";
import ForceGraph2D from 'react-force-graph-2d';


class GraphDrawer extends Component {
    render() {

        const {nodes, links} = this.props;
        const data = {
            nodes: [{id: "root"}],
            links: []
        };
        if (nodes.length !== 0 && links.length !== 0) {
            data["nodes"] = nodes;
            data["links"] = links;
        }
        const myConfig = {
            nodeHighlightBehavior: true,
            node: {
                color: "lightgreen",
                size: 120,
                highlightStrokeColor: "blue",
            },
            link: {
                highlightColor: "lightblue",
            },
        };
        return (
            // <Graph
            //     id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
            //     data={data}
            //     config={myConfig}
            // />
            <ForceGraph2D
            graphData={{data}
            //     {
            //     "nodes": [ 
            //         { 
            //           "id": "id1",
            //           "name": "name1",
            //           "val": 1 
            //         },
            //         { 
            //           "id": "id2",
            //           "name": "name2",
            //           "val": 10 
            //         },
            //     ],
            //     "links": [
            //         {
            //             "source": "id1",
            //             "target": "id2"
            //         },
            //     ]
            // }
        }
        />
        )
            ;
    }

}

export default GraphDrawer;
