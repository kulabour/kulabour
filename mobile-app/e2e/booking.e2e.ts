describe('Booking Flow', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should allow a user to book a service', async () => {
        // Assume user is already logged in or mock login
        // For this test, we might strictly need to login first if state resets
        // Or we rely on persistent state if configured

        // 1. Select a service from Home
        await expect(element(by.text('Cleaning'))).toBeVisible();
        await element(by.text('Cleaning')).tap();

        // 2. Click Book Now
        await element(by.id('book-now-btn')).tap();

        // 3. Select Date/Time & Confirm
        await element(by.id('confirm-booking-btn')).tap();

        // 4. Verify Success Message
        await expect(element(by.text('Booking Confirmed!'))).toBeVisible();
    });
});
