import dotenv from 'dotenv'

dotenv.config()

export const env = {
	n8nBaseUrl: required('N8N_BASE_URL'),
	n8nApiKey: required('N8N_API_KEY'),
	n8nTableId: required('N8N_TABLE_ID'),
	pinCode: required('PIN_CODE')
}

function required(name: string) {
	const value = process.env[name]

	if (!value) {
		throw new Error(`Missing env variable: ${name}`)
	}

	return value
}
