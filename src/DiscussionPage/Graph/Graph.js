import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const Graph = (props) => {
    return (
        <div id="graph">
            <ForceGraph2D className="graph" graphData={{
    "nodes": props.shownNodes,
    "links": props.shownLinks
}}/>
        </div>
    );
};

export default Graph;