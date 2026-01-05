"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockServiceModel = void 0;
class MockServiceModel {
    constructor(data) {
        this.data = data;
    }
    async save() { return this.data; }
    static find() { return { exec: async () => [] }; }
    static findById() { return { exec: async () => null }; }
    static findOne() { return { exec: async () => null }; }
    static create(data) { return new MockServiceModel(data); }
    static countDocuments() { return { exec: async () => 0 }; }
    static findByIdAndUpdate() { return { exec: async () => null }; }
}
exports.MockServiceModel = MockServiceModel;
//# sourceMappingURL=service.model.mock.js.map