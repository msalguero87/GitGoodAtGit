
var repository= 'm6FAjYL21-fOIwo9UY0ZV';
const url = "http://localhost:4000/";
const ApiService = {
    getRemoteFiles: function (){
        return fetch(url + 'remote?repository='+repository);
    },
    getBranches: function (){
        fetch(url + 'branches')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);
        });
    },
    executeCommand(command){
        return fetch(url + 'command', {
            method: 'POST', 
            body: JSON.stringify({command: command, repository: repository}), 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    },
    initializeRemoteRepository(){
        fetch(url + 'remote/new', {
            method: 'POST', // or 'PUT'
          }).then(res => repository = res)
          .catch(error => console.error('Error:', error));
    },
    addFile(fileName){
        return fetch(url + 'file', {
            method: 'POST', 
            body: JSON.stringify({fileName: fileName, repository: repository}), 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    },
    getFileContent(fileName){
        var urlObject = new URL(url + 'file')

        var params = {name: fileName, repository: repository};
        urlObject.search = new URLSearchParams(params).toString();
        return fetch(urlObject, {
            method: 'GET', 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    },
    addFolder(folderName){
        return fetch(url + 'folder', {
            method: 'POST', 
            body: JSON.stringify({folderName: folderName, repository: repository}), 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    },
    updateFile(fileName, text){
        return fetch(url + 'file/update', {
            method: 'POST', 
            body: JSON.stringify({fileName: fileName, fileText: text, repository: repository}), 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    },
    removeFile(fileName){
        return fetch(url + 'file/delete', {
            method: 'POST', 
            body: JSON.stringify({fileName: fileName, repository: repository}), 
            mode: 'cors',
            headers:{
              'Content-Type': 'application/json'
            }
          });
    }
}

export default ApiService;