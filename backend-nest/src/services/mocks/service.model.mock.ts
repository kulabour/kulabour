export class MockServiceModel {
    constructor(private data: any) { }
    async save() { return this.data; }
    static find() { return { exec: async () => [] }; }
    static findById() { return { exec: async () => null }; }
    static findOne() { return { exec: async () => null }; }
    static create(data: any) { return new MockServiceModel(data); }
    static countDocuments() { return { exec: async () => 0 }; }
    static findByIdAndUpdate() { return { exec: async () => null }; }
}
