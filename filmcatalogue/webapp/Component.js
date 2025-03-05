/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "filmcatalogue/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models, JSONModel) {
        "use strict";

        return UIComponent.extend("filmcatalogue.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // Cargar API_Key del usuario
                const Usuario = new JSONModel();
                Usuario.loadData("/localService/data/personalAPIKey.json");

                // El evento attachRequestCompleted se usa para asegurarse de que los datos se carguen correctamente antes de acceder a ellos
                Usuario.attachRequestCompleted(function() {
                    // Accede a los datos del modelo después de que se haya cargado el archivo JSON
                    const data = Usuario.getData(); // Obtiene los datos cargados del modelo

                    // Accede a la clave de la API, suponiendo que el archivo JSON tiene una propiedad "API_Key"
                    let API_Key = data[0].API_Key;

                    // Ahora puedes usar la variable API_Key en tu código
                    // console.log("La clave de la API es:", API_Key);

                    // Crea el modelo JSON que almacenará los datos obtenidos de la API de TMDb
                    const moviesModel = new JSONModel();

                    // Realiza la solicitud de datos a la API de TMDb para obtener la lista de películas populares
                    var dataAPI = "https://api.themoviedb.org/3/movie/upcoming?api_key="+API_Key;

                    // La URL incluye la API key y especifica la primera página de resultados
                    moviesModel.loadData(dataAPI);

                    // Crea el modelo JSON que almacenará los datos locales
                    const moviesLocalModel = new JSONModel();

                    // Realiza la solicitud de datos al modelo local para obtener la lista de películas
                    var dataLocal = "/localService/data/peliculaSet.json";

                    // Si no existe key de la API, cargamos datos del modelo local
                    moviesLocalModel.loadData(dataLocal);

                    // Este evento se ejecuta cuando la solicitud a la API se completa
                    moviesModel.attachRequestCompleted(function(oEvent) {
                        // Verifica si la solicitud fue exitosa
                        if (oEvent.getParameter("success")) { 
                        // Obtiene los resultados de la respuesta de la API; si no hay resultados, usa un arreglo vacío  
                        const aResults = moviesModel.getData().results || [];
                        
                        // Define la URL base para las imágenes de los posters en TMDb, especificando el tamaño w200
                        const sImageBaseUrl = "https://image.tmdb.org/t/p/w200";

                        // Recorre cada película en los resultados
                        aResults.forEach(movie => {
                            // Construye la URL completa del poster de la película
                            // Si `poster_path` tiene valor, añade el `poster_path` a la URL base de la imagen
                            // Si `poster_path` es `null` o está vacío, utiliza una imagen de reemplazo con un mensaje "No Image"
                            movie.poster_full_path = movie.poster_path 
                            ? sImageBaseUrl + movie.poster_path 
                            : "https://via.placeholder.com/200x300?text=No+Image"; // Imagen de reemplazo
                        });
                        
                        // Actualiza el modelo con la propiedad `/results`, ahora contiene URLs completas de los posters
                        moviesModel.setProperty("/results", aResults);
                        }
                    });

                    // Establece `moviesModel` como el modelo nombrado "moviesModel" en la vista, 
                    // para que se pueda acceder a él desde el resto de la aplicación
                    this.setModel(moviesModel, "moviesModel");

                    // Establece `moviesLocalModel` como el modelo nombrado "moviesLocalModel" en la vista, 
                    // para que se pueda acceder a él desde el resto de la aplicación
                    this.setModel(moviesLocalModel, "moviesLocalModel");
                }.bind(this));

            }
        });
    }
);