import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

const PLATFORM_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

test.describe("Auth critical path", () => {
	test("signup — fill form, submit, see verification interstitial", async ({ page }) => {
		const email = `e2e-test-${randomUUID()}@wopr.test`;

		// Mock the sign-up API
		await page.route(`${PLATFORM_BASE_URL}/api/auth/sign-up/email`, async (route) => {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					user: {
						id: randomUUID(),
						name: body?.name ?? "Test User",
						email: body?.email ?? email,
						emailVerified: false,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					session: null,
				}),
			});
		});

		await page.goto("/signup");

		// Fill the signup form
		await page.getByLabel("Name").fill("E2E Test User");
		await page.getByLabel("Email").fill(email);
		await page.getByLabel("Password", { exact: true }).fill("StrongP@ssw0rd!");
		await page.getByLabel("Confirm password").fill("StrongP@ssw0rd!");

		// Check terms checkbox
		await page.getByRole("checkbox").check();

		// Submit
		await page.getByRole("button", { name: "Create account" }).click();

		// Expect the "Transmission sent" verification interstitial (no redirect — stays on /signup)
		await expect(page.getByText("Transmission sent")).toBeVisible();
		await expect(page.getByText("We sent a verification link to")).toBeVisible();
		await expect(page.getByText(email)).toBeVisible();
	});

	test("login — fill form, submit, arrive at marketplace", async ({ page }) => {
		const sessionToken = `e2e-session-${randomUUID()}`;
		const userId = randomUUID();

		// Mock sign-in API
		await page.route(`${PLATFORM_BASE_URL}/api/auth/sign-in/email`, async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				headers: {
					"set-cookie": `better-auth.session_token=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`,
				},
				body: JSON.stringify({
					user: {
						id: userId,
						name: "E2E Test User",
						email: "e2e-login@wopr.test",
						emailVerified: true,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					session: {
						id: randomUUID(),
						userId,
						token: sessionToken,
						expiresAt: new Date(Date.now() + 86400000).toISOString(),
					},
				}),
			});
		});

		// Mock get-session (called by useSession hook on dashboard pages)
		await page.route(`${PLATFORM_BASE_URL}/api/auth/get-session`, async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					user: {
						id: userId,
						name: "E2E Test User",
						email: "e2e-login@wopr.test",
						emailVerified: true,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
					session: {
						id: randomUUID(),
						userId,
						token: sessionToken,
						expiresAt: new Date(Date.now() + 86400000).toISOString(),
					},
				}),
			});
		});

		// Navigate to login — first go to a page to set localStorage
		await page.goto("/login");
		await page.evaluate(() => {
			localStorage.setItem("wopr-onboarding-complete", "1");
		});

		// Fill login form
		await page.getByLabel("Email").fill("e2e-login@wopr.test");
		await page.getByLabel("Password").fill("TestPassword123!");

		// Submit
		await page.getByRole("button", { name: "Sign in" }).click();

		// After login, the client calls router.push(callbackUrl) which defaults to "/"
		// Middleware then redirects / -> /marketplace when session cookie is present
		await page.waitForURL("**/marketplace");
		await expect(page).toHaveURL(/\/marketplace/);
	});

	test("forgot password — fill email, submit, see confirmation", async ({ page }) => {
		const email = `e2e-test-${randomUUID()}@wopr.test`;

		// Mock password reset endpoint
		// authClient.$fetch("/request-password-reset") resolves via Better Auth client to
		// PLATFORM_BASE_URL/api/auth/request-password-reset
		await page.route(`${PLATFORM_BASE_URL}/api/auth/request-password-reset`, async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({ status: true }),
			});
		});

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
