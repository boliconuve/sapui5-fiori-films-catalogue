sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("filmcatalogue.controller.ListadoPeliculas", {
            onInit: function () {
                
            },

            onPress: function (oEvent) {
                // Conseguimos el path a la pelicula seleccionada en la tabla
                const oPeliPath = oEvent.getSource().getBindingContext("moviesModel").getPath();
                let nPeliLength = oPeliPath.split("/").length - 1;
                let nPosPelicula = oPeliPath.split("/")[nPeliLength];

                alert("Presionado la pelicula en la posición: " + nPosPelicula);

                // Conseguimos el nombre de la pelicula presionada
                

                
            },

            onSearch: function () {

            }


        });
    });
