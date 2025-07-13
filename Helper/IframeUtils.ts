import { Page, Frame } from "puppeteer"

export async function getIframeInsideContainer(page: Page, containerId: string): Promise<Frame> {
  // Wait for container div to appear
  await page.waitForSelector(`#${containerId}`, { timeout: 15000 })

  // Find the container div element handle
  const containerHandle = await page.$(`#${containerId}`)
  if (!containerHandle) throw new Error(`Container #${containerId} not found`)

  // Find iframe inside the container div
  const iframeHandle = await containerHandle.$("iframe")
  if (!iframeHandle) throw new Error(`No iframe found inside container #${containerId}`)

  // Get iframe's content frame
  const frame = await iframeHandle.contentFrame()
  if (!frame) throw new Error(`Could not get content frame for iframe inside #${containerId}`)

  return frame
}
