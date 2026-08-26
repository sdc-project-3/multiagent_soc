import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * SentinelX User Schema
 * 
 * Supports local credentials (hashed with bcrypt), Google OAuth, GitHub OAuth,
 * and unified account linking across multiple identity providers.
 */
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, dots, underscores, and dashes'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/,
        'Please provide a valid email address',
      ],
    },
    phoneNumber: {
      type: String,
      required: function () {
        // Required for local registration; optional for external OAuth creation unless updated later
        return this.authProvider === 'local'
      },
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      // Not required for OAuth-only users
      required: function () {
        return this.authProvider === 'local' && (!this.providers || this.providers.length === 0)
      },
      select: false, // Never return passwordHash in queries by default
    },
    avatar: {
      type: String,
      default: '',
    },
    clearanceLevel: {
      type: String,
      default: 'LEVEL-4 CYBER OPERATOR',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github', 'oauth'],
      default: 'local',
    },
    // Multi-provider Account Linking registry
    providers: [
      {
        provider: {
          type: String,
          enum: ['google', 'github'],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          lowercase: true,
          trim: true,
        },
        connectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexing for rapid queries and uniqueness enforcement
UserSchema.index({ 'providers.provider': 1, 'providers.providerId': 1 })

/**
 * Pre-save middleware to hash password if created or modified
 */
UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash') || !this.passwordHash) {
    return
  }

  // If passwordHash is already a bcrypt hash (starts with $2a$ or $2b$), don't re-hash
  if (/^\$2[abxy]\$\d{2}\$/.test(this.passwordHash)) {
    return
  }

  const salt = await bcrypt.genSalt(12)
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt)
})

/**
 * Method to verify candidate password against stored bcrypt hash
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    return false
  }
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

/**
 * Static method to find user by either email or username
 */
UserSchema.statics.findByEmailOrUsername = function (identifier) {
  const cleanId = (identifier || '').trim().toLowerCase()
  return this.findOne({
    $or: [{ email: cleanId }, { username: cleanId }],
  })
}

/**
 * Clean JSON representation that NEVER exposes sensitive hashes or reset tokens
 */
UserSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.resetPasswordToken
  delete obj.resetPasswordExpires
  delete obj.__v
  return obj
}

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User
