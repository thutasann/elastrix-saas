import chalk, { type ChalkInstance } from 'chalk'
import { basename } from 'path'

interface IGetLogDetails {
  fileName: string
  lineNumber: number | null
  columnNumber: number | null
}

/**
 * Custom Logger class
 */
export abstract class Logger {
  public static info(...args: any[]) {
    Logger.log(chalk.blue, '[INFO]', ...args)
  }

  public static warn(...args: any[]) {
    Logger.log(chalk.yellow, '[WARN]', ...args)
  }

  public static error(...args: any[]) {
    Logger.log(chalk.red, '[ERROR]', ...args)
  }

  private static log(colorFn: ChalkInstance, label: string, ...args: any[]) {
    const { fileName, lineNumber, columnNumber } = Logger.getLogDetails()
    const logMessage = colorFn(`[${fileName}:${lineNumber}:${columnNumber}] ${label}`)
    console.log(
      logMessage,
      ...args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : colorFn(arg))),
    )
  }

  private static getLogDetails(): IGetLogDetails {
    const oldStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => stack
    const stack = new Error().stack as any as NodeJS.CallSite[]
    Error.prepareStackTrace = oldStackTrace

    // Adjusting the stack index to capture the correct frame
    const caller = stack[3] // stack[3] because getLogDetails is at stack[0], log function is at stack[1], and the caller of log function is at stack[2]
    const fileName = basename(caller.getFileName() || '')
    const lineNumber = caller.getLineNumber()
    const columnNumber = caller.getColumnNumber()

    return { fileName, lineNumber, columnNumber }
  }
}
