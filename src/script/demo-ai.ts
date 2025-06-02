import { Streams } from '@masala/parser'
import { registerAllCommandHandlers } from '../compiler/handlers/register-handlers.js'
import { StatementExecutor } from '../compiler/interpreter/statement-executor.js'
import { buildStatementParser } from '../compiler/parser/statement-parser.js'
import { createExecutionContext } from '../compiler/interpreter/execution-context.js'

const script = `
@web/read url="https://www.robusta.build" output="site"
@utils/log message={site}
@file/write path="site.txt" content={site}
`

function splitScript(script: string): string[] {
  return script
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function runDemo() {
  const registry = registerAllCommandHandlers()
  const interpreter = new StatementExecutor(registry)
  const statements = splitScript(script)
  console.log('statements:', statements)
  const parser = buildStatementParser()
  const executionContext = createExecutionContext('Nicolas')

  for (const statement of statements) {
    console.log('Processing statement:', statement)
    const ast = parser.parse(Streams.ofString(statement))
    if (!ast.isAccepted()) {
      console.error('Failed to parse statement:', {
        statement,
        offset: ast.offset,
      })
      continue
    }
    interpreter
      .execute(ast.value, executionContext)
      .then(() => {
        console.log('Statement executed successfully:', statement)
      })
      .catch((error) => {
        console.error('Error executing statement:', statement, error)
      })
  }
}

runDemo()
