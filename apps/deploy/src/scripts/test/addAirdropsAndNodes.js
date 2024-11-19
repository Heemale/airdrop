"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("@/sdk");
var addTestAirdropsAndNodes = function () { return __awaiter(void 0, void 0, void 0, function () {
    var adminCap, nodes, rank, name_1, description, limit, price, total_quantity, result, error_1, now, oneHour, airdropParams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                adminCap = "0xADMIN_CAP_ADDRESS";
                nodes = "0xNODES_ADDRESS";
                rank = 1;
                name_1 = "Gold Node";
                description = "High-performance node with premium features.";
                limit = BigInt(100);
                price = BigInt(1000000000);
                total_quantity = BigInt(500);
                return [4 /*yield*/, sdk_1.airdropClient.insertNode(adminCap, nodes, rank, name_1, description, limit, price, total_quantity)];
            case 1:
                result = _a.sent();
                console.log("Node inserted successfully:", result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Failed to insert node:", error_1);
                return [3 /*break*/, 3];
            case 3:
                now = Date.now();
                oneHour = 60 * 60 * 1000;
                airdropParams = {
                    T: "0x2::coin::CoinType", // 替换为实际的代币类型
                    adminCap: "0x6e...", // 管理员权限对象ID
                    airdrops: "0x7a...", // 空投集合对象ID
                    round: BigInt(1), // 空投轮次，通常从1开始
                    startTime: BigInt(Date.now()), // 空投开始时间（毫秒级时间戳）
                    endTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 结束时间（+7天）
                    totalShares: BigInt(10000), // 总份额
                    totalBalance: BigInt(1000000), // 空投总金额，单位可能是最小货币单位
                    description: "Test Airdrop for Round 1", // 描述信息
                    wallet: "0x3b...", // 管理员钱包地址
                    owner: "0x5d..." // 空投的所有者地址
                };
                // 使用示例
                return [4 /*yield*/, sdk_1.airdropClient.insert(airdropParams.T, airdropParams.adminCap, airdropParams.airdrops, airdropParams.round, airdropParams.startTime, airdropParams.endTime, airdropParams.totalShares, airdropParams.totalBalance, airdropParams.description, airdropParams.wallet, airdropParams.owner)];
            case 4:
                // 使用示例
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 调用脚本
addTestAirdropsAndNodes();
