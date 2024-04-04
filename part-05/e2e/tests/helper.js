const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, content) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  const { title, author, url } = content
  console.log(title, author, url)
  await page.getByText('title').locator('input').fill(title)
  await page.getByText('author').locator('input').fill(author)
  await page.getByText('url').locator('input').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}

export { loginWith, createBlog }