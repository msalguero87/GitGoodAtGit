import ApiService from './apiService';

function RepositoryState(name, data, remote) {
    this.name = name;
    this.data = data;
    this.remote = remote;
    this.addFile = function(node, type, callback){
        if(!node)node = this.data[0];
        if(type === "folder"){ 
            node = {id: node.id, parentId: node.parentId, label: node.label, items: this.data};
            let name = this.getName(node) + "/New Folder";
            ApiService.addFolder(name).then(res => {
                console.log('Success:', res);
                if(node.items){
                    node.items.push({
                        "id": Math.floor(Math.random() * 1000),
                        "type": type,
                        "label": type === "folder" ? "New Folder" : "new.js",
                        "parentId": node.id,
                        "items": type === "folder" ? [] : undefined
                    });
                    if(callback) callback();
                }
            })
            .catch(error => console.error('Error:', error));
        }else{
            let name = this.getName(node) + "/new.js";
            ApiService.addFile(name).then(res => {
                console.log('Success:', res);
                if(node.items){
                    node.items.push({
                        "id": Math.floor(Math.random() * 1000),
                        "type": type,
                        "label": type === "folder" ? "New Folder" : "new.js",
                        "parentId": node.id,
                        "items": type === "folder" ? [] : undefined
                    });
                    if(callback) callback();
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }
    this.removeFile = function(file, fileList, callback){
        if(!fileList) fileList = this.data;
        var _self = this;
        let name = this.getName(file) + "/new.js";
        ApiService.removeFile(name).then(res => {
            console.log('Success:', res);
            for (let i = 0; i < fileList.length; i++) {
                const element = fileList[i];
                if(element.id === file.id)
                    fileList.splice(i, 1);
                else if(element.items && element.items.length > 0)
                _self.removeFile(file, element.items);
            }
            if(callback) callback();
        })
        .catch(error => console.error('Error:', error));
    }
    this.update = function(file, fileText, callback){
        let name = this.getName(file);
        ApiService.updateFile(name, fileText).then(res => {
            console.log('Success:', res);
            if(callback) callback();
        })
        .catch(error => console.error('Error:', error));
    }
    this.getName = function(node){
        var path = node.label;
        var parentId = node.parentId;
        while(parentId){
            let newNode = this.getFile(parentId);
            if(newNode){
                path = newNode.label + "/" + path;
                parentId = newNode.parentId;
            }
            else{
                parentId = undefined;
            }
        }
        return path;
    }
    this.getFile = function(id, fileList){
        if(!fileList) fileList = this.data;
        for (let i = 0; i < fileList.length; i++) {
            const element = fileList[i];
            if(element.id === id)
                return element;
            else if(element.items && element.items.length > 0)
                return this.getFile(id, element.items);
        }
    }
    this.getFolderByName = function(name, fileList){
        if(!fileList) fileList = this.data;
        for (let i = 0; i < fileList.length; i++) {
            const element = fileList[i];
            if(element.label === name)
                return element;
            else if(element.items && element.items.length > 0)
                return this.getFile(name, element.items);
        }
    }
    this.getFileContent = function(file, callback){
        let name = this.getName(file);
        console.log("test");
        ApiService.getFileContent(name).then(res => {
            console.log('Success:', res);
            res.text().then(function (text) {
                if(callback) callback(text);
              });
            
        })
        .catch(error => console.error('Error:', error));
    }

    this.getRemoteFiles = function(callback) {
        var _self = this;
        ApiService.getRemoteFiles(name)
        .then(function(response) {
            return response.json();
        })
        .then(function(files) {
            remoteRepo.data.length = 0;
            files.forEach(file => {
                var folders = file.split("/");
                if(folders.length === 1){
                    remoteRepo.data.push({
                        "id": Math.floor(Math.random() * 1000),
                        "type": "file",
                        "label": folders[0],
                        "parentId": null
                    });
                } else if (folders.length > 1){
                    let parentId = null;//Math.floor(Math.random() * 1000);
                    for (let i = 0; i < folders.length; i++) {
                        const folder = folders[i];
                        var existingFolder = _self.getFolderByName(folder);
                        if(existingFolder){
                            parentId = existingFolder.id;
                        }
                        else if(i < folders.length - 1){
                            let newId = Math.floor(Math.random() * 1000);
                            remoteRepo.data.push({
                                "id": newId,
                                "type": "folder",
                                "label": folders[i],
                                "parentId": parentId,
                                items: []
                            });
                            parentId = newId;
                        }else{
                            let parentNode = _self.getFile(parentId);
                            parentNode.items.push({
                                "id": Math.floor(Math.random() * 1000),
                                "type": "file",
                                "label": folders[i],
                                "parentId": parentNode.id
                            });
                        }
                    }
                }
            });
            if(callback)callback();
        })
        .catch(error => console.error('Error:', error));
    }
  }

var localRepo = new RepositoryState("Local File System",
     [
      {
        "id": 12345678,
        "parentId": null,
        "type": "folder",
        "label": "src",
        "items": []
      }
    ], false);

var remoteRepo = new RepositoryState("Remote Repository", 
[
    {
      "id": 12345678,
      "parentId": null,
      "type": "folder",
      "label": "src",
      "items": [
      ]
    }
  ], true);


  var Repositories = {
      remote: remoteRepo,
      local: localRepo
  }
  export default Repositories;