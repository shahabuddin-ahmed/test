import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import config from "./config/config";
import { newV1Router } from "./web/router/v1/index";
import { newAnalyzerRepo } from "./repo/analyzer";
import { newAnalyzerService } from "./service/analyzer";
import { newAnalyzerV1Controller } from "./web/controller/v1/analyzer";
import { initializeDBConnection } from "./infra/mongo";
import { globalErrorHandler } from "./web/middleware/global-error-handler";

const app = express();

app.use(cors({
    origin: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    // initializing db connection
    const db = await initializeDBConnection(
        config.MONGO.MONGO_HOST,
        config.MONGO.MONGO_DB
    );

    // Initialize Repo
    const analyzerRepo = await newAnalyzerRepo(db, "text");

    // Initialize Service
    const analyzerService = await newAnalyzerService(analyzerRepo);

    // Initialize Controller
    const analyzerV1Controller = await newAnalyzerV1Controller(analyzerService);

    // Initialize Router
    const v1Router = await newV1Router({
        analyzerController: analyzerV1Controller,
    });

    app.use(morgan("short"));
    app.use("/api/v1", v1Router);
    app.use(globalErrorHandler);
})();

export default app;
