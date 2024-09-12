import "dotenv/config";
import { getTranscript } from "./functions.js";

console.warn("##########    CONVERTING  #################");
console.log(await getTranscript());
console.warn("##########    CONVERTING  #################");
