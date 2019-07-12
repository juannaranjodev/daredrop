const isDevEnv = process.env.STAGE !== 'production'

export default value => (!isDevEnv ? value : {})
