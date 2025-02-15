import * as fs from "fs";
import * as path from "path";
import * as XXH from "xxhashjs";

export function hashFolder(folderPath:string): string {
    let hashes = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const fullPath = path.join(folderPath, file);
        if (fs.statSync(fullPath).isFile()) {
        hashes.push(hashFile(fullPath));
        }
    }

    return XXH.h32(hashes.join(""), 0xABCD).toString(16);
}

export function hashFile(filePath: string): string {
    const buffer = fs.readFileSync(filePath);
    
    return XXH.h32(buffer, 0xABCD).toString(16);
}