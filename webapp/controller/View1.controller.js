sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit: function () {
            
        },
        
        goToTree: function(evt){
            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("treeTable")
        },
        goToStandard: function(evt){
            var oRouter = this.getOwnerComponent().getRouter();

            oRouter.navTo("standardTable")
        },
    });
});
