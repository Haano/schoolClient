var webpack = require("webpack");
module.exports = {
    devServer: {
        // public: "https://759e-178-170-253-71.eu.ngrok.io/",
        disableHostCheck: true,
        port: 8080,
        sockPath: "sockjs-node",
        //  proxy: "https://759e-178-170-253-71.eu.ngrok.io:8081/",
    },

    transpileDependencies: ["vuetify"],
};