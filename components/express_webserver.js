const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const hbs = require('express-hbs');

/* eslint-disable no-param-reassign */
function webServer(controller) {
    const webserver = express();
    webserver.use((req, res, next) => {
        req.rawBody = '';

        req.on('data', (chunk) => {
            req.rawBody += chunk;
        });

        next();
    });
    webserver.use(cookieParser());
    webserver.use(bodyParser.json());
    webserver.use(bodyParser.urlencoded({ extended: true }));

    // set up handlebars ready for tabs
    webserver.engine('hbs', hbs.express4({ partialsDir: `${__dirname}/../views/partials` }));
    webserver.set('view engine', 'hbs');
    webserver.set('views', `${__dirname}/../views/`);

    // import express middlewares that are present in /components/express_middleware
    const middlewarePath = path.join(__dirname, 'middleware');

    if (fs.existsSync(middlewarePath)) {
        require('fs').readdirSync(middlewarePath).forEach((file) => {
            /* eslint-disable-next-line */
            require(`./middleware/${file}`)(webserver, controller);
        });
    }

    webserver.use(express.static('public'));

    const server = http.createServer(webserver);

    server.listen(process.env.PORT || 3000, null, () => {
        console.log(`Express webserver configured and listening at http://localhost:${process.env.PORT}` || 3000);
    });

    // import all the pre-defined routes that are present in /components/routes
    const routerPath = path.join(__dirname, 'routes');

    if (fs.existsSync(routerPath)) {
        fs.readdirSync(routerPath).forEach((file) => {
            /* eslint-disable-next-line */
            require(`./routes/${file}`)(webserver, controller);
        });
    }

    controller.webserver = webserver;
    controller.httpserver = server;

    return webserver;
}


module.exports = webServer;
