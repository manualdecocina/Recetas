export type RecipeTimerState = { remaining: number; deadline: number | null; duration: number; started: boolean }

/** Return the same state between whole-second ticks, and stop the clock at zero. */
export function advanceRecipeTimer(timer: RecipeTimerState, now = Date.now()): RecipeTimerState {
  if (timer.deadline === null) return timer
  const remaining = Math.max(0, Math.ceil((timer.deadline - now) / 1000))
  const deadline = remaining === 0 ? null : timer.deadline
  return remaining === timer.remaining && deadline === timer.deadline ? timer : { ...timer, remaining, deadline }
}

export function timerInputSeconds(minutes: string): number | null {
  const value = Number(minutes)
  const seconds = Math.round(value * 60)
  return Number.isFinite(value) && value > 0 && value <= 1440 && seconds >= 1 ? seconds : null
}
