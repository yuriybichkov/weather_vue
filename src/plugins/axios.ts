import axios from 'axios'
// import UserService from '@/services/UserService'
// import { showMessage } from '@/plugins/toast'
// import i18n from '@/i18n'

// let hasShownChunkError = false

// const localeMap: Record<string, string> = { uk: 'uk-UA', en: 'en-US' }

export default function axiosSetup() {
  axios.defaults.baseURL = import.meta.env.VITE_API || '__API__'
  console.log('axios.ts:13 | import.meta.env.VITE_API : ', import.meta.env.VITE_API);

  // axios.interceptors.request.use(async (config) => {
  //   // WARNING: This is a workaround to avoid infinite loop when refreshing token
  //   if (config.url === '/connect/token') {
  //     return config
  //   }
  //
  //   const accessToken = await AccessTokenService.getAccessToken()
  //   if (!accessToken) {
  //     await router.push('/login')
  //     return Promise.reject('No access token')
  //   }
  //
  //   config.headers.Authorization = `${accessToken.token_type} ${accessToken.access_token}`
  //
  //   // @ts-ignore
  //   const currentLanguage = localeMap[i18n.global.locale.value] || 'uk-UA'
  //   config.headers['Accept-Language'] = currentLanguage
  //
  //   return config
  // })

  // axios.interceptors.response.use(
  //   (response) => {
  //     return response
  //   },
  //   async (error) => {
  //     const response = error?.response
  //     const requestIdHeader = response?.headers?.['x-request-id']
  //     const requestId = requestIdHeader ? ` Request ID: ${requestIdHeader}` : ''
  //
  //     // if (requestId && response?.status === 500 && response?.data?.title) {
  //     //   showMessage({ message: response.data.title + requestId, type: 'error' })
  //     // }
  //     if (error.config?.skipErrorHandler) {
  //       return Promise.reject(error)
  //     }
  //
  //     if (axios.isCancel(error)) {
  //       console.log('Request canceled:', error.message)
  //       return Promise.resolve()
  //     }
  //
  //     const status = response?.status
  //
  //     if (status === 404) {
  //       return Promise.reject(error)
  //     }
  //
  //     if (status === 403 && response?.data?.reason === 'UnauthorizedIP') {
  //       await router.push('/403')
  //       return Promise.reject(error)
  //     }
  //
  //     if (status === 401) {
  //       try {
  //         await UserService.refreshToken()
  //       } catch (error) {
  //         await UserService.logout()
  //         await router.push('/login')
  //         return Promise.reject(error)
  //       }
  //     }
  //
  //     if (response && response.data) {
  //       if (response.data.errors && Object.values(response.data.errors).length) {
  //         Object.values(response.data.errors).forEach((messages: any) => {
  //           messages.forEach((message: string) => {
  //             showMessage({ message: message, type: 'error' })
  //           })
  //         })
  //       } else if (response.data.detail) {
  //         showMessage({ message: response.data.detail, type: 'error' })
  //       } else if (response.data.title) {
  //         showMessage({ message: response.data.title, type: 'error' })
  //       }
  //     } else {
  //       console.log('error.response.data', error)
  //       if (error.message?.includes('Failed to fetch dynamically imported module')) {
  //         if (!hasShownChunkError) {
  //           showMessage({
  //             message: 'An error occurred while loading the page. Please reload the page.',
  //             type: 'error',
  //             timeout: 10000,
  //           })
  //           hasShownChunkError = true
  //           setTimeout(() => {
  //             hasShownChunkError = false
  //           }, 10000)
  //         }
  //       } else {
  //         showMessage({ message: error.message + requestId, type: 'error' })
  //       }
  //     }
  //
  //     return Promise.reject(error)
  //   },
  // )
}
