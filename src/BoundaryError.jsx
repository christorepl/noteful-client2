import React, { Component } from 'react';

export default class BoundaryError extends Component {
    state= {
        hasError: false
    };

    static getDerivedStateFromError(error){
        return { hasError : true};
    }
    
    render(){
        if (this.state.hasError) {
            return (
                <h2>Error: Could not load data.</h2>
            );
        }
        return this.props.children;
    }
}