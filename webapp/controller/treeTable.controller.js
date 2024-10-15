sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.treeTable", {
        onInit: function () {
            this.getView().setModel(new JSONModel());
        },
        onImportJSONPress: function () {
            var fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/json';
            fileInput.onchange = this.handleFileSelect.bind(this);
            fileInput.click();
        },

        handleFileSelect: function (event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        var jsonData = JSON.parse(e.target.result);
                        var hierarchicalData = this._convertToHierarchy(jsonData);
                        this._displayJSONData(hierarchicalData);
                    } catch (error) {
                        MessageToast.show("Erreur lors de la lecture du fichier JSON");
                    }
                }.bind(this);
                reader.readAsText(file);
            }
        },

        _convertToHierarchy: function (jsonData) {
            var aData = Array.isArray(jsonData) ? jsonData : [jsonData];
            return aData.map(this._mapObjectToTree.bind(this));
        },

        _mapObjectToTree: function (obj) {
            var children = [];
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];

                if (typeof value === 'object' && !Array.isArray(value)) {
                    children.push({
                        name: key,
                        value: "",
                        children: [this._mapObjectToTree(value)]
                    });
                } else if (Array.isArray(value)) {
                    var listChildren = value.map(this._mapObjectToTree.bind(this));
                    children.push({
                        name: key + "[]",
                        value: "",
                        children: listChildren
                    });
                } else {
                    children.push({
                        name: key,
                        value: value,
                        children: []
                    });
                }
            }.bind(this));

            return {
                name: obj.name || "Root",
                value: "",
                children: children
            };
        },

        _displayJSONData: function (hierarchicalData) {
            var oTable = this.getView().byId("jsonTreeTable");

            oTable.removeAllColumns();

            oTable.addColumn(new sap.ui.table.Column({
                label: new sap.m.Label({ text: "Nom" }),
                template: new sap.m.Text({ text: "{name}" })
            }));
            oTable.addColumn(new sap.ui.table.Column({
                label: new sap.m.Label({ text: "Valeur" }),
                template: new sap.m.Text({ text: "{value}" })
            }));

            var oModel = new JSONModel(hierarchicalData);
            this.getView().setModel(oModel);
        }
        
    });
});
