import React from 'react';
import './console.css';
import ApiService from './apiService';
const $ = window.$;

class Console extends React.Component {
    constructor(props) {
      super(props);
    }
  
    componentDidMount() {
        let _self = this;
        $('.console').click(function() {
            $('.console-input').focus()
        });
        var cmdHistory = []
        var cursor = -1
        // Get User Command
        $('.console-input').on('keydown', function(event) {
            if (event.which === 38) {
                // Up Arrow
                cursor = Math.min(++cursor, cmdHistory.length - 1)
                $('.console-input').val(cmdHistory[cursor])
            } else if (event.which === 40) {
                // Down Arrow
                cursor = Math.max(--cursor, -1)
                if (cursor === -1) {
                $('.console-input').val('')
                } else {
                $('.console-input').val(cmdHistory[cursor])
                }
            } else if (event.which === 13) {
                event.preventDefault();
                cursor = -1
                let cmd = _self.input();
                cmdHistory.unshift(cmd)
                if (cmd.trim() === '') {
                    _self.output('')
                } else {
                    ApiService.executeCommand(cmd)
                    .then(res => {
                        console.log('Success:', res);
                        res.text().then(function (text) {
                            _self.output(text);
                          });
                    })
                    .catch(error => console.error('Error:', error));
                }
            }
        });
    }

    output(print) {
        if (!window.md) {
          window.md = window.markdownit({
            linkify: true,
            breaks: true
          })
        }
        $("#outputs").append(window.md.render(print))  
        $(".console").scrollTop($('.console-inner').height());
      }

      input() {
        var cmd = $('.console-input').val()
        $("#outputs").append("<div class='output-cmd'>" + cmd + "</div>")
        $('.console-input').val("")
        //autosize.update($('textarea'))
       // $("html, body").animate({
        //  scrollTop: $(document).height()
        //}, 300);
        return cmd
      }

    render() {
      return (
        <div className='console'>
            <div className='console-inner'>
                <div id="outputs">
                </div>
                <div className='output-cmd'><textarea className='console-input' placeholder="Type command..."></textarea></div>
            </div>
        </div>
      );
    }
  }

export default Console;
