import { bypassOnboarding, expect, mockAuthAPI, test, testEmail } from "./fixtures/auth";

test.describe("Auth critical path", () => {
	test("signup — fill form, submit, see verification interstitial", async ({ page }) => {
		const email = testEmail();

		await mockAuthAPI(page);
		await page.goto("/signup");
		await bypassOnboarding(page);

		// Fill the signup form via JS evaluation to avoid React re-render race conditions
		// (password strength meter + Better Auth session polling cause rapid DOM updates).
		const PASSWORD = "StrongP@ssw0rd!";
		await page.evaluate(
			({ testEmail, pwd }) => {
				function triggerReactInput(id: string, value: string) {
					const el = document.getElementById(id) as HTMLInputElement | null;
					if (!el) return;
					const nativeSetter = Object.getOwnPropertyDescriptor(
						HTMLInputElement.prototype,
						"value",
					)?.set;
					nativeSetter?.call(el, value);
					el.dispatchEvent(new Event("input", { bubbles: true }));
					el.dispatchEvent(new Event("change", { bubbles: true }));
				}
				triggerReactInput("name", "E2E Test User");
				triggerReactInput("email", testEmail);
				triggerReactInput("password", pwd);
				triggerReactInput("confirm-password", pwd);
			},
			{ testEmail: email, pwd: PASSWORD },
		);

		// Check terms checkbox using Playwright's built-in check (handles React controlled checkboxes)
		await page.locator('input[type="checkbox"]').check({ force: true });

		// Wait for React to process all state updates
		await page.waitForTimeout(300);

		// Submit
		await page.evaluate(() => {
			const form = document.getElementById("signup-form") as HTMLFormElement | null;
			form?.requestSubmit();
		});

		// Expect the "Transmission sent" verification interstitial (no redirect — stays on /signup)
		await expect(page.getByText("Transmission sent")).toBeVisible();
		await expect(page.getByText("We sent a verification link to")).toBeVisible();
		await expect(page.getByText(email)).toBeVisible();
	});

	test("login — fill form, submit, arrive at marketplace", async ({ page }) => {
		await mockAuthAPI(page);

		// Navigate to login with callbackUrl so the login handler redirects to /marketplace
		await page.goto("/login?callbackUrl=/marketplace");
		await bypassOnboarding(page);

		// Fill login form
		await page.getByLabel("Email").fill("e2e@wopr.test");
		await page.getByLabel("Password").fill("TestPassword123!");

		// Submit
		await page.getByRole("button", { name: "Sign in" }).click();

		// After login, the client calls router.push(callbackUrl) which defaults to "/"
		// Middleware then redirects / -> /marketplace when session cookie is present
		// Wait for the auth redirect + middleware chain to settle
		await page.waitForURL("**/marketplace");
		await expect(page).toHaveURL(/\/marketplace/);
	});

	test("forgot password — fill email, submit, see confirmation", async ({ page }) => {
		const email = testEmail();

		await mockAuthAPI(page);
		await page.goto("/forgot-password");

		// Fill the email
		await page.getByLabel("Email").fill(email);

		// Submit
		await page.getByRole("button", { name: "Send reset link" }).click();

		// Expect the "Transmission sent" confirmation
		await expect(page.getByText("Transmission sent")).toBeVisible();
		await expect(page.getByText("We sent a password reset link to")).toBeVisible();
		await expect(page.getByText(email)).toBeVisible();
	});
});
