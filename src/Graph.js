import {Component} from "react";
import React from "react";
import {Graph} from "react-d3-graph";
import Delayed from "./Delayed";

class GraphDrawer extends Component {
    render() {

        const {nodes, links} = this.props;
        const data = {
            // nodes: [{id: "Harry"}, {id: "Sally"}, {id: "Alice"}],
            nodes:[],
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
            <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={data}
                config={myConfig}
            />
        )
            ;
    }

}

export default GraphDrawer;
