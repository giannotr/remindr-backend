import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { createItemsRouter } from './routes/items.js'
import { authRouter } from './routes/auth.js'

export function createRemindrApp<T>(options: {
	clientPath: string,
	matchKey?: string,
  mapItemToRow: (item: {
    id: string
    label: string
    checked: boolean
  }) => Partial<T>,
}) {
  const app = express()

  app.use(express.json())
	app.use(cors({
		origin: [
			process.env.APP_DEV_URL ?? '',
			process.env.APP_PUBLIC_URL ?? '',
		],
	}))

	app.get('/api/health', (_req, res) => {
		res.json({ ok: true })
	})

  app.use('/api/items', createItemsRouter<T>(options.mapItemToRow, options.matchKey ?? 'id'))
  app.use('/api/auth', authRouter)

	const isProduction = process.env.NODE_ENV === 'production'

	if (isProduction) {
		const frontendDistPath = path.resolve(process.cwd(), options.clientPath)

		app.use(express.static(frontendDistPath))

		app.get('*', (_req, res) => {
			res.sendFile(path.join(frontendDistPath, 'index.html'))
		})
	}

  return app
}
