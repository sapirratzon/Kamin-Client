import React, { Component } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import "./Graph.css"

class Graph extends Component {

    constructor(props) {
        super(props);
        this.myRef = null;
        this.state = {
            rootNode: props.rootNode ? props.rootNode : {},
            currentUserNode: null,
            highlightLink: null,
            highlightNode: null,
            selectedLink: null
        };
        this.NODE_R = 4;
    }

    componentDidMount() {
        this.myRef.zoom(4, 0)
    }

    handleLinkHover(link) {
        this.setState({
            highlightLink: link
        });
    }

    paintRing(node, ctx) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, this.NODE_R * 1.2 + node.val* 1.2, 0, 2 * Math.PI, false);
        if (this.props.rootId === node.id) {
            ctx.fillStyle = 'rgba(255,255,51,0.6)';
        } else if (this.props.currentUser === node.id) {
            ctx.fillStyle = 'rgba(51,153,255,0.6)';

        } else if (this.state.highlightNode === node) {
            ctx.fillStyle = 'rgba(170,170,170,0.6)';
        }
        ctx.fill();
    }

    selectedNode(node, event) {
            this.setState({
                highlightNode: node
            });  
        this.props.updateSelectedUser(node.id)
    }

    selectedLink(link, event) {
        this.setState({
            selectedLink: link
        });
        this.props.updateSelectedLink(link)
    }

    handleNodeHover(node) {
        this.setState({
            highlightNode: node
        });
    }

    render() {
        if (this.props.nodes != null) {
            return (
                <React.Fragment>
                    {this.props.allowHide && <a href="#presentGraph" data-toggle="collapse" onClick={this.props.handleHide}><h4><i className="fa fa-angle-down p-2"  /></h4></a>}
                    <div id="graph-container" >
                        <ForceGraph2D
                            className="graph"
                            ref={element => { this.myRef = element }}
                            width={window.innerWidth / 2.053}
                            height={window.innerHeight / 2.026}
                            // backgroundColor={"rgba(204,204,204,0.8)"}
                            nodeRelSize={this.NODE_R}
                            // d3Force={"center"}
                            graphData={{
                                "nodes": this.props.nodes,
                                "links": this.props.links
                            }}

                            // linkDirectionalParticles={4}
                            // linkDirectionalParticleWidth={link => link === this.state.highlightLink ? 4 : 0}
                            // linkDirectionalParticleSpeed={link => link.width * 0.01}
                            // onLinkHover={this.handleLinkHover.bind(this)}

                            linkWidth="width"
                            linkCurvature="curvature"
                            linkDirectionalArrowRelPos={1}
                            linkDirectionalArrowLength={2.5}
                            // cooldownTicks={1} // Todo: what Is this for??? 

                            nodeCanvasObjectMode={node =>
                                this.state.highlightNode === node || 
                                this.props.rootId === node.id || this.props.currentUser === node.id ? 'before' : undefined}
                            nodeCanvasObject={this.paintRing.bind(this)}
                            onNodeClick={this.selectedNode.bind(this)}
                            onLinkClick={this.selectedLink.bind(this)}
                        // onNodeHover={this.handleNodeHover.bind(this)}
                        />
                    </div >
                </React.Fragment>
            );
        }
    };
}

export default Graph;
