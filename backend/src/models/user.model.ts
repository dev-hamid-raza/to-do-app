import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface IUser extends Document {
	email: string;
	fullName: string;
	password: string;
	avatar?: string;
	refreshToken?: string
    comparePassword(candidatePassword: string): Promise<boolean>
	generateAccessToken(): {accessToken: string, refreshToken: string}
	generateRefreshToken(): string
}

const userSchema: Schema<IUser> = new Schema(
	{
		email: {
			type: String,
			required: [true, 'Email is required'],
			lowercase: true,
			unique: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please provide the valid email'],
		},
		fullName: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
		},
		password: {
			required: true,
			minlength: [8, 'Password must be at least 6 characters'],
			select: false,
		},
		avatar: {
			type: String,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

// Pre save middleware to hash the password

userSchema.pre('save', async function (next)  {
    if(!this.isModified('password')) return next()
    
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    } catch (error) {
        console.log(error)
    }
})


userSchema.methods.comparePassword = async function (candidatePassword: string) {
    try {
        return await bcrypt.compare(candidatePassword, this.password)
    } catch (error) {
        return false
    }
}


userSchema.methods.generateAccessToken = async function() {
	const accessToken = jwt.sign({
		email: this.email,
		_id: this._id,
		fullName: this.fullName
	},
	String(process.env.ACCESS_TOKEN_SECRET),
	{
		expiresIn: "1d"
	}	
)

	const refreshToken = this.generateRefreshToken()

	return {accessToken, refreshToken}
}

userSchema.methods.generateRefreshToken =async function() {
	const refreshToken = jwt.sign({
		_id: String(this._id)
	},
	String(process.env.REFRESH_TOKEN_SECRET),

	{
		expiresIn:  "7d"
	}
)
	this.refreshToken = refreshToken
	this.save()
	return refreshToken
}

const User = mongoose.model<IUser>('User', userSchema)

export { User }