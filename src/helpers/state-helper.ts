import { Dispatch, SetStateAction } from 'react'

export const pushValueToArrayState = <T extends string | number>(value: T, state: Dispatch<SetStateAction<T[]>>) => {
  state((prevState) => {
    prevState.push(value)

    return prevState
  })
}

export const removeValueFromArrayState = <T extends string | number>(
  value: T,
  state: Dispatch<SetStateAction<T[]>>,
) => {
  state((prevState) => {
    const index = prevState.indexOf(value)

    prevState.splice(index, 1)

    return prevState
  })
}
