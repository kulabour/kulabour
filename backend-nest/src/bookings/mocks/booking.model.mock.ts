export class MockBookingModel {
    constructor(private data: any) { }
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
    static create(data: any) { return new MockBookingModel(data); }
    static countDocuments() { return { exec: async () => 0 }; }
    static aggregate() { return { exec: async () => [] }; }
}
