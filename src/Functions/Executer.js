import * as GlobalFunctions from "/src/Functions/Registry.js";

export function ExecuteGlobalFunc(FunctionName, Args = []) {
    const Func = GlobalFunctions[FunctionName];

    if (typeof Func !== "function") {
        console.error("Global function not found:", FunctionName);
        return;
    }

    Func(...Args);
}