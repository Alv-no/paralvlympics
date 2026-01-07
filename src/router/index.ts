import { useCompetitionsStore } from '@/stores/useCompetitionsStore'
import { useContestantsStore } from '@/stores/useContestantsStore'
import { useTeamsStore } from '@/stores/useTeamsStore'
import { createRouter, createWebHistory } from 'vue-router'

const baseRouteName = 'base'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    component: () => import('@/layout/BaseLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/BaseView.vue'),
        name: baseRouteName,
        meta: {
          breadcrumb: () => [{ name: 'Paralympics', to: null }],
        },
      },
    ]
  }
  ],
})

router.beforeEach(async () => {
  const { fetchTeams } = useTeamsStore()
  await fetchTeams()

  const { fetchContestants } = useContestantsStore()
  await fetchContestants()

  const { fetchCompetitions } = useCompetitionsStore()
  await fetchCompetitions()
})

export default router
