import { prisma } from '@/lib/prisma'

export type SubscriptionPlan = 'free' | 'pro' | 'business'
export type SubscriptionStatus = 'active' | 'canceled' | 'trial' | 'expired'

export interface PlanLimits {
  heartbeatsPerMinute: number
  apiKeysMax: number
  metricsRetentionDays: number
  aiUsageEnabled: boolean
  teamsEnabled: boolean
  exportEnabled: boolean
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    heartbeatsPerMinute: 100,
    apiKeysMax: 3,
    metricsRetentionDays: 30,
    aiUsageEnabled: false,
    teamsEnabled: false,
    exportEnabled: false,
  },
  pro: {
    heartbeatsPerMinute: 1000,
    apiKeysMax: 10,
    metricsRetentionDays: 90,
    aiUsageEnabled: true,
    teamsEnabled: false,
    exportEnabled: true,
  },
  business: {
    heartbeatsPerMinute: -1, // unlimited
    apiKeysMax: -1, // unlimited
    metricsRetentionDays: 365,
    aiUsageEnabled: true,
    teamsEnabled: true,
    exportEnabled: true,
  },
}

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId },
    include: {
      payments: {
        orderBy: { id: 'desc' },
        take: 5,
      },
    },
  })
}

export async function getUserPlanLimits(userId: string): Promise<PlanLimits> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return PLAN_LIMITS.free
  }

  // Check if subscription is active
  if ((subscription.status as SubscriptionStatus) !== 'active') {
    return PLAN_LIMITS.free
  }

  // Check if trial has expired
  if ((subscription.status as SubscriptionStatus) === 'trial' && subscription.trialEndsAt && subscription.trialEndsAt < new Date()) {
    return PLAN_LIMITS.free
  }

  return PLAN_LIMITS[subscription.plan]
}

export async function canUserPerformAction(userId: string, action: keyof PlanLimits): Promise<boolean> {
  const limits = await getUserPlanLimits(userId)

  switch (action) {
    case 'aiUsageEnabled':
      return limits.aiUsageEnabled
    case 'teamsEnabled':
      return limits.teamsEnabled
    case 'exportEnabled':
      return limits.exportEnabled
    default:
      return true
  }
}

export async function checkApiKeyLimit(userId: string): Promise<{ allowed: boolean, current: number, max: number }> {
  const limits = await getUserPlanLimits(userId)

  const currentKeys = await prisma.apiKey.count({
    where: { userId, status: 'active' },
  })

  const max = limits.apiKeysMax === -1 ? Infinity : limits.apiKeysMax

  return {
    allowed: currentKeys < max,
    current: currentKeys,
    max,
  }
}

// eslint-disable-next-line unused-imports/no-unused-vars
export async function checkHeartbeatLimit(userId: string, apiKeyId: string): Promise<{ allowed: boolean, remaining: number }> {
  const limits = await getUserPlanLimits(userId)

  if (limits.heartbeatsPerMinute === -1) {
    return { allowed: true, remaining: -1 }
  }

  // This would integrate with rate limiting
  // For now, return allowed since rate limiting is handled separately
  return { allowed: true, remaining: limits.heartbeatsPerMinute }
}

export async function createOrUpdateSubscription(
  userId: string,
  plan: SubscriptionPlan,
  providerCustomerId?: string,
  providerSubscriptionId?: string,
  trialEndsAt?: Date,
) {
  return prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: trialEndsAt ? 'trial' : 'active',
      providerCustomerId,
      providerSubscriptionId,
      trialEndsAt,
      updatedAt: new Date(),
    },
    create: {
      userId,
      plan,
      status: trialEndsAt ? 'trial' : 'active',
      providerCustomerId,
      providerSubscriptionId,
      trialEndsAt,
    },
  })
}

// eslint-disable-next-line unused-imports/no-unused-vars
export async function cancelSubscription(userId: string, cancelAtPeriodEnd = true) {
  return prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
      updatedAt: new Date(),
    },
  })
}
