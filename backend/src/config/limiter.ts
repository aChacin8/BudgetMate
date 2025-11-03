import { rateLimit } from "express-rate-limit"

export const getLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    message: { error: 'Too many requests, please try again later.'}
})

export const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    message: { error: 'Too many post requests, please try again later.'}
})

export const deleteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    message: { error: 'Too many delete requests, please try again later.'}
})

export const tokenLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 10,
    message: { error: 'Too many token requests, please try again later.'}
})

export const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 200,
    message: { error: 'Too many requests from this IP, please try again later.'}
})