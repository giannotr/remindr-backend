import { Router } from 'express'
import { env } from '../env.js'

export const authRouter = Router()

authRouter.post('/', async (req, res) => {
	const { body } = req
	const authCheck = body.pinCode === env.pinCode
	res.status(200).json({ authCheck })
})
