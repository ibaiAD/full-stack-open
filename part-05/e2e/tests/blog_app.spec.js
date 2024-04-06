const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'new blog' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        const content = {
          title: 'Playwright Test',
          author: 'Playwright',
          url: 'https://playwright.dev/'
        }
        await createBlog(page, content)

        const successDiv = page.locator('.success')
        await expect(successDiv).toContainText(`a new blog ${content.title} by ${content.author} added`)
        await expect(successDiv).toHaveCSS('border-style', 'solid')
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
        await expect(page.getByText(`${content.title} ${content.author}`)).toBeVisible()
      })

      describe('and several blogs exist', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, {
            title: 'Test 1',
            author: 'Playwright',
            url: 'https://test-one.com'
          })
          await createBlog(page, {
            title: 'Test 2',
            author: 'Playwright',
            url: 'https://test-two.com'
          })
          await createBlog(page, {
            title: 'Test 3',
            author: 'Playwright',
            url: 'https://test-three.com'
          })
        })

        test('likes can be edited', async ({ page }) => {
          const secondBlog = page.getByText('Test 2 Playwright')
          await secondBlog.getByRole('button', { name: 'view' }).click()
          const secondBlogElement = secondBlog.locator('..')

          await expect(secondBlogElement).toContainText('likes 0')
          await secondBlogElement.getByRole('button', { name: 'like' }).click()
          await expect(secondBlogElement).toContainText('likes 1')
        })

        test('the user who added the blog can delete it', async ({ page }) => {
          const secondBlog = page.getByText('Test 2 Playwright')
          await secondBlog.getByRole('button', { name: 'view' }).click()
          const secondBlogElement = secondBlog.locator('..')

          page.on('dialog', dialog => dialog.accept())
          await secondBlogElement.getByRole('button', { name: 'remove' }).click()
          await secondBlogElement.waitFor({ state: 'detached' })
          await expect(page.getByText('Test 2 Playwright')).not.toBeVisible()
        })

        describe('and several users exist', () => {
          beforeEach(async ({ request }) => {
            await request.post('/api/users', {
              data: {
                name: 'John Doe',
                username: 'jdoe',
                password: 'se7en'
              }
            })
          })

          test('only the user who added the blog sees the remove button', async ({ page }) => {
            const secondBlog = page.getByText('Test 2 Playwright')
            await secondBlog.getByRole('button', { name: 'view' }).click()
            const secondBlogElement = secondBlog.locator('..')

            await expect(secondBlogElement.getByRole('button', { name: 'remove' })).toBeVisible()
            await page.getByRole('button', { name: 'logout' }).click()
            await loginWith(page, 'jdoe', 'se7en')
            await expect(page.getByText('John Doe logged in')).toBeVisible()

            await secondBlog.getByRole('button', { name: 'view' }).click()
            await expect(secondBlogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
          })
        })
      })
    })
  })
})