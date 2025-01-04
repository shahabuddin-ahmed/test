import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import config from "./config/config";
import { newV1Router } from "./web/router/v1/index";
import { newTextRepo } from "./repo/text";
import { newTextService } from "./service/text";
import { newTextV1Controller } from "./web/controller/v1/text";
import { initializeDBConnection } from "./infra/mongo";
import { globalErrorHandler } from "./web/middleware/global-error-handler";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {

    // initializing db connection
    const db = await initializeDBConnection(config.MONGO.MONGO_HOST, config.MONGO.MONGO_DB);

    // Initialize Repo
    const textRepo = await newTextRepo(db, "text");

    // Initialize Service
    const textService = await newTextService(textRepo);

    // Initialize Controller
    const textV1Controller = await newTextV1Controller(textService);
    
    // Initialize Router
    const v1Router = await newV1Router({
        textController: textV1Controller,
    });

    app.use(morgan("short"));
    app.use("/api/v1", v1Router);
    app.use(globalErrorHandler);

})();

export default app;
