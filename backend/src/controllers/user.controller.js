import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
	const { email, fullName, password } = req.body;

	// 1. Validate required fields
	if (!email || !fullName || !password) {
		throw new ApiError(400, 'All fields are required');
	}

	// 2. Check if user already exists
	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new ApiError(409, 'User with this email already exists');
	}

	// 3. Create user
	const user = await User.create({ email, fullName, password });

	// 4. Generate tokens
	const { accessToken, refreshToken } = await user.generateAccessToken();

	// 5. Set cookies (optional based on your app strategy)
	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 24 * 60 * 60 * 1000, // 1 day
	});

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	// 6. Send response
	return res.status(201).json(
		new ApiResponse(201, {
			user: {
				_id: user._id,
				fullName: user.fullName,
				email: user.email,
				avatar: user.avatar || null,
			},
			accessToken,
			refreshToken,
		}, 'User registered successfully')
	);
});
