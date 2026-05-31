import { env } from './env.js'

export const n8nHeaders = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	'X-N8N-API-KEY': env.n8nApiKey,
}

export const n8nRowsUrl =
	`${env.n8nBaseUrl}/api/v1/data-tables/${env.n8nTableId}/rows`
