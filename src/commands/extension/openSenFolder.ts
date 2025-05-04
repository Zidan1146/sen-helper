import { getSenPath } from "@/utils/sen";
import { spawn } from "child_process";

export function execute() {
    return async() => {
        const senPath = getSenPath();
        spawn(`start ${senPath}`);
    };
}