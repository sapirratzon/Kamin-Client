import React, { Component } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import "./Graph.css"

class Graph extends Component {

    constructor() {
        super();
        this.myRef = null;
    }

    componentDidMount() {
        this.myRef.zoom(4, 0)
    }

    render() {
        if (this.props.nodes != null) {
            return (
                <div id="graph-container">
                    <ForceGraph2D className="graph"
                                  ref={element => { this.myRef = element }}
                                  width={935}
                                  height={566}
                                  d3Force={"center"}
                                  graphData={{
                                      "nodes": this.props.nodes,
                                      "links": this.props.links
                                  }}
                                  linkWidth="width"
                                  linkCurvature="curvature"
                                  linkDirectionalArrowRelPos={1}
                                  linkDirectionalArrowLength={2.5}
                                  cooldownTicks={1}
                    />
                </div>
            );
        }
    };
}

export default Graph;
