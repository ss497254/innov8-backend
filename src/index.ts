require("./config");
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { getEnvConfig } from "./config";
import { CorsOrigin } from "./constants/allowed-cors-origin";
import { InitializeFirebase, TestFirebase } from "./firebase/setup";
import { ErrorHandler, InitRequest } from "./middlewares";

const app = express();

const port = getEnvConfig("PORT");

async function bootstrap() {
    await InitializeFirebase();
    TestFirebase();

    app.set("x-powered-by", false);
    app.set("trust proxy", 1);
    app.use(cookieParser());
    app.use(
        cors({
            origin: CorsOrigin,
            credentials: true,
        })
    );
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // request logging and cookie processing
    app.use(InitRequest);

    require("./routes")(app);

    app.use((_, res) => {
        res.status(404).json({ success: false, message: "Route Not Found" });
    });

    app.use(ErrorHandler);

    app.listen(port, () => {
        console.log(
            "\x1b[32m\x1b[1m\nSERVER STARTED!\n     ProcessID:",
            process.pid,
            "\x1b[0m",
            "\x1b[1m",
            `\n     URL: http://localhost:${port} \n`,
            "\x1b[0m"
        );
    });
}

(async () => {
    try {
        await bootstrap();
    } catch (e: any) {
        console.error("Server: error on launch\n", e.stack);
    }
})();
