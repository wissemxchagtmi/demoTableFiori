sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.standardTable", {
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
                        this._displayJSONData(jsonData);
                    } catch (error) {
                        MessageToast.show("Erreur lors de la lecture du fichier JSON");
                    }
                }.bind(this);
                reader.readAsText(file);
            }
        },

        _displayJSONData: function (jsonData) {
            var oTable = this.getView().byId("jsonTable");
            oTable.removeAllColumns();

            var aData = Array.isArray(jsonData) ? jsonData : [jsonData];

            var oFirstRow = aData[0];
            if (oFirstRow) {
                var aColumns = this._getColumnHeaders(oFirstRow);
                aColumns.forEach(function (key) {
                    oTable.addColumn(new sap.m.Column({
                        header: new sap.m.Label({ text: key })
                    }));
                });

                var oModel = new JSONModel(aData);
                this.getView().setModel(oModel);

                oTable.bindItems("/", new sap.m.ColumnListItem({
                    cells: aColumns.map(function (key) {
                        return new sap.m.Text({ text: "{" + key + "}" });
                    })
                }));
            }
        },

        _getColumnHeaders: function (obj, prefix) {
            var keys = [];
            prefix = prefix || "";

            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                var newKey = prefix + key;

                if (typeof value === 'object' && !Array.isArray(value)) {
                    keys = keys.concat(this._getColumnHeaders(value, newKey + "."));
                } else if (Array.isArray(value)) {
                    keys.push(newKey + "[]");
                } else {
                    keys.push(newKey);
                }
            }.bind(this));

            return keys;
        }
    });
});
