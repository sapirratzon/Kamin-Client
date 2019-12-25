import React, { Component, createRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

class Graph extends Component{
    constructor(props){
        super(props);
    }

    render(){
        if (this.props.nodes!=null) {
            return (
                <div id="graph-container" ref={this.graphContainerRef}>
                    <ForceGraph2D ref={this.graphRef} className="graph"
                        width={550}
                        height={350}
                        d3Force={"center"}
                        graphData={{
                            "nodes": this.props.nodes,
                            "links": this.props.links
                        }}
                        linkDirectionalArrowLength={2}
                        linkDirectionalArrowRelPos={1}
                        // linkDirectionalParticles={2}
                        />
                </div>
            );
        }
    };
}

export default Graph;