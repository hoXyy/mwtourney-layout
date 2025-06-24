"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sr_com_1 = require("./sr-com");
const timer_1 = require("./timer");
exports.default = (nodecg) => {
    (0, sr_com_1.initSrc)(nodecg).then(() => {
        nodecg.log.info('Speedrun.com module ready.');
    });
    (0, timer_1.initTimer)(nodecg).then(() => {
        nodecg.log.info('Timer module ready.');
    });
};
//# sourceMappingURL=index.js.map