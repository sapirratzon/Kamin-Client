import React, { Component } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

class Graph extends Component{
    // constructor(props){
    //     super(props);
    // }

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
                        linkDirectionalArrowRelPos={1}
                        linkWidth={link =>{
                            if (link.width <= 5) {return link.width;} else {return 5;}}}
                                  linkDirectionalArrowLength={2}
                        cooldownTicks={1}
                        //dagLevelDistance={20}
                        // linkDirectionalParticles={2}
                        />
                </div>
            );
        }
    };
}

export default Graph;