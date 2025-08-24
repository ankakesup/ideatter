import { useState, useEffect } from 'react';
import './timeline.css';

// Tailwind CSSを読み込むためのscriptタグをindex.htmlに追加してください
// <script src="https://cdn.tailwindcss.com"></script>

// ツイートデータの型定義 (バックエンドのIdeaOutモデルと一致させる)
interface Idea {
  ideaId: number;
  username: string;
  explanationA: string;
  explanationB: string;
  explanationC: string;
  description: string;
  timestamp: string; // JSONで渡される際は文字列になるためstring型で受け取る
  likes: number;
}

// Timelineコンポーネントのprops型定義
interface TimelineProps {
  refreshTrigger?: number;
}

// メインのTimelineコンポーネント
const API_URL = import.meta.env.VITE_API_URL;
const Timeline = (
  { refreshTrigger }: TimelineProps,
) => {
  // ツイートのリストを保持するstate
  const [Ideas, setIdeas] = useState<Idea[]>([]);
  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(true);
  // エラーメッセージを保持するstate
  const [error, setError] = useState<string | null>(null);

  // ツイートを取得する非同期関数
  const fetchIdeas = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // API URLが設定されているかチェック
      if (!API_URL) {
        throw new Error('API URLが設定されていません。.envファイルでVITE_API_URLを設定してください。');
      }
      
      console.log('Fetching from:', `${API_URL}/ideas`);
      const response = await fetch(`${API_URL}/ideas`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`データの取得に失敗しました。ステータス: ${response.status}, 詳細: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('APIからJSONではないレスポンスが返されました。サーバーが正常に動作していることを確認してください。');
      }
      
      const data: Idea[] = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // いいねボタンのクリックハンドラー
  const addlike = async (id: number) => {
    try {

      // 楽観的更新はしない (バックエンドの仕様上，値が大きくズレた経験があるため)
      Ideas[Ideas.length - id].likes += 1;
      setIdeas([...Ideas]);

      const response = await fetch(`${API_URL}/ideas/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Like error:', errorText);
        return;
      }
      
    } catch (err) {
      console.error('Like request failed:', err);
    }
  }

  // コンポーネントが最初にマウントされた時とrefreshTriggerが変更された時にツイートを取得
  useEffect(() => {
    fetchIdeas();
  }, [refreshTrigger]); // refreshTriggerが変更された時も実行される

  return (
    <>
      <div className="timeline-screen">
        <div className="container">

          {/* エラーメッセージ表示 */}
          {error && <div className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</div>}

          {/* タイムライン */}
          <main>
            <h2 className="timeline-title">みんなのアイデア</h2>
            {isLoading ? (
              <p className="loading-message">読み込み中...</p>
            ) : (
              <div className="timeline-list">
                {Ideas.map((idea) => (
                  <div key={idea.ideaId} className="timeline-idea">
                    <div className="idea-header">
                      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold mr-3">
                        {idea.username.charAt(0)}
                      </div>
                      <div>
                        <p className="idea-username">{idea.username}</p>
                        <p className="idea-timestamp">
                          {new Date(idea.timestamp).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <p className="idea-text">{idea.explanationA}</p>
                    <p className="idea-text">{idea.explanationB}</p>
                    <p className="idea-text">{idea.explanationC}</p>
                    <div className="idea-likes-area">
                      <button className="idea-likes-button" onClick={() => addlike(idea.ideaId)}>
                        いいね
                      </button>
                      <p className="idea-likes-counter">{idea.likes} likes</p>
                    </div>

                    <div className="idea-likes-area">
                      <button className="idea-create-button" onClick={() => alert('未実装です。')}>
                        作ってみたい!!
                      </button>
                      {/* <p className="idea-create-counter">{idea.likes} users</p> */}
                      <p className="idea-create-counter">未実装</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default Timeline;