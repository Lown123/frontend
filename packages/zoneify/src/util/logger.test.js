/* eslint-disable no-console */
const PassThroughStream = require('stream').PassThrough
const {
  formatter, log, levels, spinner,
} = require('./logger')

global.console = {
  log: jest.fn(),
}

const start = jest.spyOn(spinner, 'start')
const stop = jest.spyOn(spinner, 'stop')
const getPassThroughStream = () => {
  const stream = new PassThroughStream()
  const noop = () => {}

  stream.writable = true
  stream.write = noop
  stream.clearLine = noop
  stream.cursorTo = noop
  stream.moveCursor = noop
  return stream
}

spinner.stream = getPassThroughStream()
spinner.isEnabled = true

describe('logger', () => {
  const message = 'test'
  const debugOutput = formatter({ level: 'debug', message })
  const errorOutput = formatter({ level: 'error', message })
  const infoOutput = formatter({ level: 'info', message })

  it('should have log levels', () => {
    expect(levels).toMatchSnapshot()
  })

  it('should a default log level of info', () => {
    expect(log.level).toBe('info')
  })

  Object.keys(levels).forEach((level) => {
    it(`should have a method for ${level}`, () => {
      expect(typeof log[level]).toBe('function')
    })

    it(`should set the log level to ${level}`, () => {
      log.level = level
      expect(log.level).toBe(level)
    })
  })

  it('should set not change the log level', () => {
    const originalLevel = log.level

    log.level = 'hello world'
    expect(log.level).toBe(originalLevel)
  })

  it('should format debug logs', () => {
    expect(debugOutput).toMatchSnapshot()
  })

  it('should format info logs', () => {
    expect(infoOutput).toMatchSnapshot()
  })

  it('should format error logs', () => {
    expect(errorOutput).toMatchSnapshot()
  })

  it('should format error/info/debug logs differently', () => {
    expect(debugOutput).not.toEqual(infoOutput)
    expect(debugOutput).not.toEqual(errorOutput)
    expect(errorOutput).not.toEqual(infoOutput)
  })
  const spinnerMessage = 'Test'

  it('should start/stop the spinner', () => {
    spinner.start(spinnerMessage)
    spinner.isSpinning = true
    log.info('Test')
    expect(stop).toBeCalled()
    expect(start).toBeCalledWith(spinnerMessage)

    start.mockReset()
    spinner.stop()
    stop.mockReset()
  })

  it('should not start/stop the spinner', () => {
    log.info('Test')
    expect(stop).not.toBeCalled()
    expect(start).not.toBeCalledWith(spinnerMessage)
  })

  it('should not log debug messages when info', () => {
    log.level = 'info'
    expect(log.level).toBe('info')
    log.debug('Test debug')
    expect(console.log).not.toBeCalled()
  })

  afterEach(() => {
    console.log.mockReset()
  })
})
