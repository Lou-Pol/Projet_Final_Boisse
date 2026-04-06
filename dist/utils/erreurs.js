"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repondreErreur = void 0;
const repondreErreur = (res, err, message) => {
    console.error(message, err);
    return res.status(500).json({ message });
};
exports.repondreErreur = repondreErreur;
