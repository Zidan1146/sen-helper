import { senUtils } from "@/utils";

export function execute() {
    return async () => {
        senUtils.openSenGui();
    };
}