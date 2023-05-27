import express = require("express");

declare global {
    namespace Express {
        interface Request {
            session: { id: string; [x: string]: any };
        }
    }
}
