import sideEffects from './module'
import spectronMocks from '../../test/spectronMocks'

const {
  module: { uuid, nowUtcTimestamp },
} = spectronMocks('side-effect', sideEffects)

export { uuid, nowUtcTimestamp }
