import { useAuth } from '@clerk/react'
import { ThemeProvider } from './context/ThemeContext'
import { WallpaperProvider } from './context/WallpaperContext'
import { Navigate, Route, Routes } from 'react-router'
import ChatPage from './pages/ChatPage'
import AuthPage from './pages/AuthPage'
import PageLoader from './components/PageLoader'
import { useAuthStore } from './store/useAuthStore'
import { useChatStore } from './store/useChatStore'
import { useEffect } from 'react'

import { requestNotificationPermission } from './lib/notification'
import { Toaster } from 'react-hot-toast'

function App() {

  const { isSignedIn, isLoaded } = useAuth();

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      checkAuth();
      requestNotificationPermission();
    } else {
      clearAuth();
    }
  }, [checkAuth, clearAuth, isLoaded, isSignedIn]);

  // Handle Service Worker notification click message events (for mobile & desktop)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleSwMessage = (event) => {
        if (event.data?.type === 'NAVIGATE_CHAT' && event.data.conversationId) {
          useChatStore.getState().setActiveConversationId(event.data.conversationId);
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
    }
  }, []);

  // Handle direct URL query parameter navigation when opened from notification click (e.g. /?chat=123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatId = params.get('chat');
    if (chatId) {
      useChatStore.getState().setActiveConversationId(chatId);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!isLoaded || (isSignedIn && isCheckingAuth)) return <PageLoader />

  return (
    <ThemeProvider>
      <WallpaperProvider>
        <Routes>

          <Route path='/' element={isSignedIn ? <ChatPage /> : <Navigate to={'/auth'} replace />} />
          <Route path='/auth' element={!isSignedIn ? <AuthPage /> : <Navigate to={'/'} replace />} />

        </Routes>

        <Toaster />
      </WallpaperProvider>
    </ThemeProvider>
  )
}

export default App
