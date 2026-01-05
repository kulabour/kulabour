"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VoiceHealthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceHealthService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
let VoiceHealthService = VoiceHealthService_1 = class VoiceHealthService {
    constructor() {
        this.logger = new common_1.Logger(VoiceHealthService_1.name);
        this.websocketConnections = 0;
        this.lastHealthStatus = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastChecked: new Date(),
        };
    }
    onModuleInit() {
        this.logger.log('Voice Health Monitoring Service initialized');
        this.runHealthCheck();
    }
    trackConnection(connected) {
        if (connected) {
            this.websocketConnections++;
        }
        else {
            this.websocketConnections = Math.max(0, this.websocketConnections - 1);
        }
    }
    trackRequest(success, responseTime) {
        this.lastHealthStatus.totalRequests++;
        if (success) {
            this.lastHealthStatus.successfulRequests++;
        }
        else {
            this.lastHealthStatus.failedRequests++;
        }
        const total = this.lastHealthStatus.totalRequests;
        const currentAvg = this.lastHealthStatus.averageResponseTime;
        this.lastHealthStatus.averageResponseTime =
            (currentAvg * (total - 1) + responseTime) / total;
    }
    async runHealthCheck() {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            active_websockets: this.websocketConnections,
            requests: this.lastHealthStatus,
            issues: [],
            auto_fixes_applied: [],
        };
        const successRate = this.lastHealthStatus.totalRequests > 0
            ? (this.lastHealthStatus.successfulRequests / this.lastHealthStatus.totalRequests) * 100
            : 100;
        if (successRate < 70 && this.lastHealthStatus.totalRequests > 10) {
            health.status = 'degraded';
            health.issues.push(`Low success rate: ${successRate.toFixed(1)}%`);
            this.logger.warn(`Voice service degraded: ${successRate.toFixed(1)}% success rate`);
        }
        if (this.lastHealthStatus.averageResponseTime > 3000) {
            health.status = 'slow';
            health.issues.push(`Slow response: ${this.lastHealthStatus.averageResponseTime}ms avg`);
            this.logger.warn(`Voice service slow: ${this.lastHealthStatus.averageResponseTime}ms avg response`);
        }
        const timeSinceCheck = Date.now() - this.lastHealthStatus.lastChecked.getTime();
        if (timeSinceCheck > 3600000) {
            this.resetMetrics();
            health.auto_fixes_applied.push('Reset stale metrics');
        }
        this.lastHealthStatus.lastChecked = new Date();
        return health;
    }
    getHealthStatus() {
        return {
            timestamp: new Date().toISOString(),
            websockets: {
                active: this.websocketConnections,
            },
            requests: this.lastHealthStatus,
        };
    }
    resetMetrics() {
        this.lastHealthStatus = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastChecked: new Date(),
        };
        this.logger.log('Health metrics reset');
    }
};
exports.VoiceHealthService = VoiceHealthService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VoiceHealthService.prototype, "runHealthCheck", null);
exports.VoiceHealthService = VoiceHealthService = VoiceHealthService_1 = __decorate([
    (0, common_1.Injectable)()
], VoiceHealthService);
//# sourceMappingURL=voice-health.service.js.map