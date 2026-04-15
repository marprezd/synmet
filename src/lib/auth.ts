import process from 'node:process'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { routing } from '@/i18n/routing'

const localeRegex = /^\/([a-z]{2})/

// Helper function to fetch user email from GitHub API
async function getGithubUserEmail(token: string) {
  try {
    // First try to get email from user endpoint
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!userResponse.ok) {
      console.error('Failed to fetch GitHub user data:', userResponse.statusText)
      return null
    }

    const userData = (await userResponse.json()) as any

    // If email is available in user endpoint, return it
    if (userData.email) {
      return userData.email
    }

    // If not available, try to get public email from /user/emails endpoint
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!emailsResponse.ok) {
      console.error('Failed to fetch GitHub user emails:', emailsResponse.statusText)
      return null
    }

    const emails = (await emailsResponse.json()) as any[]

    // Find the primary or public email
    if (Array.isArray(emails) && emails.length > 0) {
      // Prefer primary email
      const primaryEmail = emails.find(e => e.primary)
      if (primaryEmail?.email) {
        return primaryEmail.email
      }

      // Otherwise use the first public email
      const publicEmail = emails.find(e => !e.private)
      if (publicEmail?.email) {
        return publicEmail.email
      }

      // Fallback to first email if nothing else is available
      if (emails[0]?.email) {
        return emails[0].email
      }
    }

    return null
  }
  catch (error) {
    console.error('Error fetching GitHub user email:', error)
    return null
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  // adapter: {
  //   ...prismaAdapter,
  //   linkAccount: async (data: any) => {
  //     // Filter fields not supported by the Prisma schema
  //     const { refresh_token_expires_in, ...filteredData } = data as any
  //     return prismaAdapter.linkAccount?.(filteredData)
  //   },
  // },
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      profile: async (profile) => {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email, // This might be null if email is private
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // If GitHub email is not in the profile, fetch it from GitHub API
      if (account?.provider === 'github' && !user.email && account?.access_token) {
        const githubEmail = await getGithubUserEmail(account.access_token)
        if (githubEmail) {
          user.email = githubEmail
          // Update the user in the database with the email
          // try {
          //   await prisma.user.update({
          //     where: { id: user.id },
          //     data: { email: githubEmail },
          //   })
          // }
          // catch (error) {
          //   console.error('Failed to update user email in database:', error)
          // }
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // If the callback URL begins with /, it's relative
      if (url.startsWith('/')) {
        // Check if the URL already has a locale prefix
        const localeMatch = url.match(localeRegex)
        if (localeMatch && routing.locales.includes(localeMatch[1] as any)) {
          // URL already has a locale, use it as is
          return `${baseUrl}${url}`
        }
        // Add default locale prefix
        return `${baseUrl}/${routing.defaultLocale}${url === '/' ? '/dashboard' : url}`
      }

      // For absolute URLs, verify they're from the same origin
      try {
        const urlObj = new URL(url, baseUrl)
        if (urlObj.origin === baseUrl) {
          return url
        }
      }
      catch {
        // Invalid URL
      }

      // Default redirect to workspace
      return `${baseUrl}/${routing.defaultLocale}/dashboard`
    },

    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id
        token.email = user.email
      }
      return token
    },
    session: ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
        session.user.email = token.email || session.user.email
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})
