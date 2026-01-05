describe('KULABOUR - Critical User Flows', () => {
    beforeAll(async () => {
        await device.launchApp();
    });

    beforeEach(async () => {
        await device.reloadReactNative();
    });

    describe('Authentication Flow', () => {
        it('should complete OTP signup flow', async () => {
            // Enter phone number
            await element(by.id('phone-input')).typeText('9876543210');
            await element(by.id('send-otp-btn')).tap();

            // Verify OTP screen appears
            await waitFor(element(by.id('otp-input')))
                .toBeVisible()
                .withTimeout(5000);

            // Enter OTP (in test mode, accept any OTP)
            await element(by.id('otp-input')).typeText('123456');
            await element(by.id('verify-otp-btn')).tap();

            // Verify home screen
            await waitFor(element(by.id('home-screen')))
                .toBeVisible()
                .withTimeout(5000);
        });
    });

    describe('Booking Flow', () => {
        beforeEach(async () => {
            // Login first
            await element(by.id('phone-input')).typeText('9876543210');
            await element(by.id('send-otp-btn')).tap();
            await element(by.id('otp-input')).typeText('123456');
            await element(by.id('verify-otp-btn')).tap();
            await waitFor(element(by.id('home-screen'))).toBeVisible();
        });

        it('should create a booking successfully', async () => {
            // Select service
            await element(by.id('service-plumber')).tap();

            // Select date
            await element(by.id('date-picker')).tap();
            await element(by.text('Tomorrow')).tap();

            // Select time
            await element(by.id('time-slot-10am')).tap();

            // Enter address
            await element(by.id('address-input')).typeText('123 Test Street');

            // Confirm booking
            await element(by.id('confirm-booking-btn')).tap();

            // Verify booking confirmation
            await waitFor(element(by.id('booking-success')))
                .toBeVisible()
                .withTimeout(5000);

            await expect(element(by.text('Booking Confirmed'))).toBeVisible();
        });

        it('should show booking in orders list', async () => {
            // Navigate to orders
            await element(by.id('tab-orders')).tap();

            // Verify booking appears
            await waitFor(element(by.id('booking-list')))
                .toBeVisible()
                .withTimeout(3000);

            await expect(element(by.text('Plumber'))).toBeVisible();
        });
    });

    describe('Payment Flow', () => {
        it('should process payment successfully', async () => {
            // Assume booking is created
            await element(by.id('tab-orders')).tap();
            await element(by.id('booking-item-0')).tap();

            // Tap pay now
            await element(by.id('pay-now-btn')).tap();

            // Verify payment modal
            await waitFor(element(by.id('payment-modal')))
                .toBeVisible()
                .withTimeout(3000);

            // Select payment method
            await element(by.id('payment-method-upi')).tap();

            // Confirm payment
            await element(by.id('confirm-payment-btn')).tap();

            // Verify success
            await waitFor(element(by.text('Payment Successful')))
                .toBeVisible()
                .withTimeout(10000);
        });
    });

    describe('Search Flow', () => {
        it('should search for workers', async () => {
            // Tap search
            await element(by.id('search-input')).tap();
            await element(by.id('search-input')).typeText('plumber');

            // Verify results
            await waitFor(element(by.id('worker-list')))
                .toBeVisible()
                .withTimeout(3000);

            await expect(element(by.text('Plumber'))).toBeVisible();
        });

        it('should filter workers by rating', async () => {
            await element(by.id('filter-btn')).tap();
            await element(by.id('rating-filter-4')).tap();
            await element(by.id('apply-filters-btn')).tap();

            // Verify filtered results
            await waitFor(element(by.id('worker-list')))
                .toBeVisible()
                .withTimeout(3000);
        });
    });
});
