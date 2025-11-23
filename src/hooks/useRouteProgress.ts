import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
  trickleSpeed: 200,
  trickle: true, // полоска автоматически доползёт при загрузке
})

export const useRouteProgress = () => {
  const location = useLocation()

  useEffect(() => {
    NProgress.start()

    const timer = setTimeout(() => {
      NProgress.done()
    }, 500) // даём времени на загрузку

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [location.pathname])
}
