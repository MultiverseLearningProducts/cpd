import { useState } from 'react'
import { Meteor } from 'meteor/meteor'

export function useMethod(methodName, { transform } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const call = (...args) => {
    setIsLoading(true)
    // console.debug('USEMETHOD CALL', methodName, args)
    return new Promise((resolve, reject) => {
      Meteor.call(methodName, ...args, (err, result) => {
        // console.debug('USEMETHOD RESPONSE:', { methodName, err, result })
        if (err) {
          setError(err)
          reject(err)
        } else {
          setData(transform ? transform(result) : result)
          resolve(result)
        }
        setIsLoading(false)
      })
    })
  }

  return { isLoading, data, error, call }
}
