import { createHash } from "crypto";

export const hashId = (id) => {
    return createHash("sha256").update(String(id)).digest("hex");
};