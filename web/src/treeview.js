import React from 'react';
import Tree from '@naisutech/react-tree';


function TreeView(props){
    const onSelect = selectedNode => {
        if(props.selectedNode)
            props.selectedNode(selectedNode);
    }
    return(
        <Tree nodes={props.data} theme={'light'} onSelect={onSelect} />
    );
}

export default TreeView;