"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBookingModel = void 0;
class MockBookingModel {
    constructor(data) {
        this.data = data;
    }
    async save() { return this.data; }
    static find() {
        return {
            sort: () => ({
                limit: () => ({
                    exec: async () => []
                })
            }),
            exec: async () => []
        };
    }
    static findById() { return { exec: async () => null }; }
    static findOne() { return { exec: async () => null }; }
    static create(data) { return new MockBookingModel(data); }
    static countDocuments() { return { exec: async () => 0 }; }
    static aggregate() { return { exec: async () => [] }; }
}
exports.MockBookingModel = MockBookingModel;
//# sourceMappingURL=booking.model.mock.js.map