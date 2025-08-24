import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import Header from './menu/header'
import Timeline from './TL/timeline'
import Post from './TL/post'

const MainApp = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 投稿成功時にタイムラインを更新する関数
  const handlePostSuccess = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <>
      <Header />
      <div className="main-screen">
        <Timeline refreshTrigger={refreshTrigger}/>
        <Post onPostSuccess={handlePostSuccess}/>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
