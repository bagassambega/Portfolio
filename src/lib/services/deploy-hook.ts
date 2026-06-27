export async function triggerStaticMediaDeploy() {
  const deployHookUrl = process.env.STATIC_MEDIA_DEPLOY_HOOK_URL
  if (!deployHookUrl) return

  try {
    const response = await fetch(deployHookUrl, { method: "POST" })
    if (!response.ok) {
      console.warn(
        `[static-media] Deploy hook failed: ${response.status} ${response.statusText}`
      )
    }
  } catch (error) {
    console.warn(
      `[static-media] Deploy hook failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}
