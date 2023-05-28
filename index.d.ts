import express = require("express");

declare global {
    namespace Express {
        interface Request {
            session: { id: string; role: string; [x: string]: any };
        }
    }
}
