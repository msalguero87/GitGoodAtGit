import CodeFlask from 'codeflask';
import React from 'react';

class Editor extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    componentDidMount() {
        const flask = new CodeFlask('#editor', { language: 'js' });
        var _self = this;
        console.log(this.props.repository);
        if(this.props.repository && this.props.repository.getFileContent)
        this.props.repository.getFileContent(this.props.file, function(text){
            console.log('Success:', text);
            flask.updateCode(text);
                flask.onUpdate((code) => {
                    if(_self.props.onChange)
                        _self.props.onChange(code);
                });
        })
        
        
    }

    render() {
      return (
        <div id="editor">
          
        </div>
      );
    }
  }

export default Editor;