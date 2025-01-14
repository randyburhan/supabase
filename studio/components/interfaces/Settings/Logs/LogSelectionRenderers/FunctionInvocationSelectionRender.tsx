import dayjs from 'dayjs'
import { filterFunctionsRequestResponse } from 'lib/logs'
import { PreviewLogData } from '..'
import { LOGS_TAILWIND_CLASSES } from '../Logs.constants'
import { jsonSyntaxHighlight, ResponseCodeFormatter, SelectionDetailedRow } from '../LogsFormatters'

const FunctionInvocationSelectionRender = ({ log }: { log: PreviewLogData }) => {
  const metadata = log.metadata?.[0]
  const request = metadata?.request?.[0]
  const response = metadata?.response?.[0]
  const method = request?.method
  const status = response?.status_code
  const requestUrl = new URL(request?.url)
  const executionTimeMs = metadata.execution_time_ms
  const deploymentId = metadata.deployment_id
  const timestamp = dayjs(log.timestamp / 1000)

  return (
    <>
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding} space-y-2`}>
        <SelectionDetailedRow label="Status" value={status} valueRender={<ResponseCodeFormatter value={status} />} />
        <SelectionDetailedRow label="Method" value={method} />
        <SelectionDetailedRow
          label="Timestamp"
          value={dayjs(timestamp).format('DD MMM, YYYY HH:mm')}
        />
        <SelectionDetailedRow label="Execution Time" value={`${executionTimeMs}ms`} />
        <SelectionDetailedRow label="Deployment ID" value={deploymentId} />
        <SelectionDetailedRow label="Log ID" value={log.id} />
        <SelectionDetailedRow
          label="Request Path"
          value={requestUrl.pathname + requestUrl.search}
        />
      </div>
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding}`}>
        <h3 className="text-lg text-scale-1200 mb-4">Request body</h3>
        <pre className="text-sm syntax-highlight overflow-x-auto">
          <div
            className="text-wrap"
            dangerouslySetInnerHTML={{
              __html: request ? jsonSyntaxHighlight(filterFunctionsRequestResponse(request)) : '',
            }}
          />
        </pre>
      </div>
      <div className={`${LOGS_TAILWIND_CLASSES.log_selection_x_padding}`}>
        <h3 className="text-lg text-scale-1200 mb-4">
          Response{method ? ` ${method}` : null} body
        </h3>
        <pre className="text-sm syntax-highlight overflow-x-auto">
          <div
            dangerouslySetInnerHTML={{
              __html: response ? jsonSyntaxHighlight(filterFunctionsRequestResponse(response)) : '',
            }}
          />
        </pre>
      </div>
    </>
  )
}

export const FunctionInvocationHeaderRender = (log: any) => {
  const method = log?.method
  const path = log?.request?.url

  return `${method} ${path}`
}

export default FunctionInvocationSelectionRender
