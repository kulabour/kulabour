describe('Authentication Flow', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    it('should allow a user to login via OTP', async () => {
        // 1. Enter Mobile Number
        await expect(element(by.id('mobile-input'))).toBeVisible();
        await element(by.id('mobile-input')).typeText('9876543210');
        await element(by.id('get-otp-btn')).tap();

        // 2. Enter OTP (Assuming debug mode or pre-filled for tests)
        await expect(element(by.id('otp-input'))).toBeVisible();
        await element(by.id('otp-input')).typeText('1234'); // Mock OTP
        await element(by.id('verify-btn')).tap();

        // 3. Verify Home Screen (User is logged in)
        await expect(element(by.id('home-screen'))).toBeVisible();
    });

    it('should show error for invalid phone number', async () => {
        await element(by.id('mobile-input')).typeText('000');
        await element(by.id('get-otp-btn')).tap();

        await expect(element(by.text('Invalid mobile number'))).toBeVisible();
    });
});
