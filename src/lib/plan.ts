import type { PlanLimits, SubscriptionPlan } from './subscription'
import { PLAN_LIMITS } from './subscription'

export interface PlanFeature {
  name: string
  description: string
  included: boolean
  limit?: string | number
}

export interface PlanDetails {
  id: SubscriptionPlan
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: PlanFeature[]
  limits: PlanLimits
  popular?: boolean
}

export const PLANS: PlanDetails[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for individual developers getting started',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      {
        name: 'Heartbeat tracking',
        description: 'Track your coding activity',
        included: true,
        limit: '100/minute',
      },
      {
        name: 'API Keys',
        description: 'Connect your editors and tools',
        included: true,
        limit: 3,
      },
      {
        name: 'Basic analytics',
        description: 'View your coding patterns',
        included: true,
      },
      {
        name: 'Data retention',
        description: 'How long your data is stored',
        included: true,
        limit: '30 days',
      },
      {
        name: 'AI usage tracking',
        description: 'Track time spent with AI assistants',
        included: false,
      },
      {
        name: 'Team features',
        description: 'Collaborate with your team',
        included: false,
      },
      {
        name: 'Data export',
        description: 'Export your data in various formats',
        included: false,
      },
    ],
    limits: PLAN_LIMITS.free,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious developers who want advanced insights',
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    features: [
      {
        name: 'Heartbeat tracking',
        description: 'Track your coding activity',
        included: true,
        limit: '1000/minute',
      },
      {
        name: 'API Keys',
        description: 'Connect your editors and tools',
        included: true,
        limit: 10,
      },
      {
        name: 'Advanced analytics',
        description: 'Detailed insights and trends',
        included: true,
      },
      {
        name: 'Data retention',
        description: 'How long your data is stored',
        included: true,
        limit: '90 days',
      },
      {
        name: 'AI usage tracking',
        description: 'Track time spent with AI assistants',
        included: true,
      },
      {
        name: 'Team features',
        description: 'Collaborate with your team',
        included: false,
      },
      {
        name: 'Data export',
        description: 'Export your data in various formats',
        included: true,
      },
    ],
    limits: PLAN_LIMITS.pro,
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and organizations that need everything',
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    features: [
      {
        name: 'Heartbeat tracking',
        description: 'Track your coding activity',
        included: true,
        limit: 'Unlimited',
      },
      {
        name: 'API Keys',
        description: 'Connect your editors and tools',
        included: true,
        limit: 'Unlimited',
      },
      {
        name: 'Enterprise analytics',
        description: 'Advanced team insights and reporting',
        included: true,
      },
      {
        name: 'Data retention',
        description: 'How long your data is stored',
        included: true,
        limit: '1 year',
      },
      {
        name: 'AI usage tracking',
        description: 'Track time spent with AI assistants',
        included: true,
      },
      {
        name: 'Team features',
        description: 'Collaborate with your team',
        included: true,
      },
      {
        name: 'Data export',
        description: 'Export your data in various formats',
        included: true,
      },
    ],
    limits: PLAN_LIMITS.business,
  },
]

export function getPlanById(planId: SubscriptionPlan): PlanDetails | undefined {
  return PLANS.find(plan => plan.id === planId)
}

export function getAllPlans(): PlanDetails[] {
  return PLANS
}

export function getPopularPlan(): PlanDetails | undefined {
  return PLANS.find(plan => plan.popular)
}

export function comparePlans(planA: SubscriptionPlan, planB: SubscriptionPlan): number {
  const order = ['free', 'pro', 'business']
  return order.indexOf(planA) - order.indexOf(planB)
}

export function isUpgrade(from: SubscriptionPlan, to: SubscriptionPlan): boolean {
  return comparePlans(from, to) < 0
}

export function isDowngrade(from: SubscriptionPlan, to: SubscriptionPlan): boolean {
  return comparePlans(from, to) > 0
}
