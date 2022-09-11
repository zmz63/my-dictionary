export function equantSlice<T>(list: T[], delta: number) {
  const length = Math.ceil(list.length / delta)
  const dyadicLsit: T[][] = new Array(length)
  for (let i = 0; i < list.length - 1; i++) {
    dyadicLsit[i] = list.slice(i * delta, (i + 1) * delta)
  }
  dyadicLsit[length - 1] = list.slice((length - 1) * delta)

  return dyadicLsit
}

export function allResolved<T>(values: Promise<T>[]) {
  let count = 0
  const result: T[] = []
  return new Promise<T[]>(resolve => {
    for (const item of values) {
      item
        .then(data => {
          result.push(data)
        })
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .catch(() => {})
        // eslint-disable-next-line no-loop-func
        .finally(() => {
          count++
          if (count === values.length) resolve(result)
        })
    }
  })
}
