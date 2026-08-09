// Contestant card background photos, keyed by team id: lag1.png -> team 1, lag2.png -> team 2, etc.
// Resolved with import.meta.glob rather than static imports so a team without a
// photo simply falls back to the team-colour gradient instead of failing the build.
const files = import.meta.glob<string>('./images/contestant_background/lag*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})

export const teamBackgrounds: Record<number, string> = Object.fromEntries(
  Object.entries(files).flatMap(([path, url]) => {
    const teamId = path.match(/lag(\d+)\.\w+$/)?.[1]
    return teamId ? [[Number(teamId), url]] : []
  }),
)
