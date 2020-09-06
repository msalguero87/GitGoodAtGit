import React from 'react';
import TreeView from './treeview';
import Editor from './editor';

class Repository extends React.Component {
    constructor(props) {
      super(props);
      this.state = { mode: 'files', selectedFile: null, fileText: '' };
    }
  
    componentDidMount() {
        
    }

    selectedNode(node){
        if(node.type === "file")
            this.setState({mode: 'edit', selectedFile: node});
        else
            this.setState({ selectedFile: node});
    }

    addFolder(){
        var _self = this;
        this.props.repository.addFile(this.state.selectedFile, "folder", function () {
            _self.forceUpdate();
        });
    }

    addFile(){
        var _self = this;
        this.props.repository.addFile(this.state.selectedFile, "file", function () {
            _self.forceUpdate();
        });
    }

    saveChanges(){
        var _self = this;
        this.props.repository.update(this.state.selectedFile, this.state.fileText, function () {
            _self.setState({mode: 'files', selectedFile: null, fileText: ''});
        });
    }

    backToFiles(){
        this.setState({mode: 'files', selectedFile: null});
    }

    delete(){
        var _self = this;
        this.props.repository.removeFile(this.state.selectedFile, function () {
            _self.setState({mode: 'files', selectedFile: null});
        });
    }

    refresh(){
        var _self = this;
        this.props.repository.getRemoteFiles(function() {
            _self.forceUpdate();
        });
    }

    onEditorChange(code){
        this.setState({fileText: code});
    }

    render() {
        let buttons;
        let content = <TreeView data={this.props.repository.data} selectedNode={this.selectedNode.bind(this)} />
        if(this.state.mode === "edit")
            content = <Editor onChange={this.onEditorChange.bind(this)} repository={this.props.repository} file={this.state.selectedFile} />;
        if(this.props.repository.remote){
            buttons = (<ul className="right hide-on-med-and-down">
                <li><span className="waves-effect waves-light btn-small" onClick={this.refresh.bind(this)}>Refresh</span></li>
                </ul>);
            if(this.state.mode === "edit")
                buttons = (<ul className="right hide-on-med-and-down">
                    <li><span className="waves-effect waves-light btn-small" onClick={this.backToFiles.bind(this)}>Back</span></li>
                    </ul>);
        }else{
            buttons = (<ul className="right hide-on-med-and-down">
                <li><span className="waves-effect waves-light btn-small" onClick={this.addFolder.bind(this)}>Add Folder</span></li>
                <li><span className="waves-effect waves-light btn-small" onClick={this.addFile.bind(this)}>Add File</span></li>
                </ul>);
            if(this.state.mode === "edit")
                buttons = (<ul className="right hide-on-med-and-down">
                    <li><span className="waves-effect waves-light btn-small" onClick={this.delete.bind(this)}>Delete</span></li>
                    <li><span className="waves-effect waves-light btn-small" onClick={this.backToFiles.bind(this)}>Back</span></li>
                    <li><span className="waves-effect waves-light btn-small" onClick={this.saveChanges.bind(this)}>Save</span></li>
                    </ul>);
        }
        
        return (
            <div className="section">
                <nav>
                    <div className="nav-wrapper blue darken-1">
                    <span className="brand-logo">{this.props.repository.name}</span>
                        {buttons}
                    </div>
                </nav>
                <div className="repository-content">
                    {content}
                </div>
            </div>
        );
    }
  }

export default Repository;