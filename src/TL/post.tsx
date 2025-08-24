import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import './post.css';

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

// Postコンポーネントのprops型定義
interface PostProps {
  onPostSuccess?: () => void;
}

// メインのAppコンポーネント
const API_URL = import.meta.env.VITE_API_URL;

const Post = ({ onPostSuccess }: PostProps) => {
  // 新しいツイートのユーザー名を保持するstate
  const [newUsername, setNewUsername] = useState('user');
  // 新しいツイートの内容を保持するstate
  const [newIdeaContent, setNewIdeaContent] = useState('');
  // description内容を保持するstate
  const [newDescription, setNewDescription] = useState('');
  // description-areaの表示/非表示を制御するstate
  const [showDescription, setShowDescription] = useState(false);
  // エラーメッセージを保持するstate
  const [error, setError] = useState<string | null>(null);

  // ツイート投稿フォームの送信処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    
    // エラーをリセット
    setError(null);
    
    // バリデーション
    if (!newUsername.trim()) {
      setError('ユーザー名を入力してください。');
      return;
    }
    if (!newIdeaContent.trim()) {
      setError('アイデアを入力してください。');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/post/idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: newUsername, // 入力されたユーザー名を使用
          explanationA: newIdeaContent,
          explanationB: '', // 他のフィールドも必要に応じて設定
          explanationC: '',
          description: newDescription,
          likes: 0,
        }),
      });

      if (!response.ok) {
        throw new Error('ツイートの投稿に失敗しました。');
      }

      // 投稿成功時の処理
      setNewIdeaContent(''); // フォームをクリア
      setNewDescription(''); // descriptionもクリア
      setError(null); // エラーをクリア
      
      // 親コンポーネントに投稿成功を通知
      if (onPostSuccess) {
        onPostSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    }
  };

  return (
    <div className="post-screen">
      <div className="post-container">
        
        {/* ツイート投稿フォーム */}
        <div className="post-form">
          <form onSubmit={handleSubmit}>
            <div className="post-header">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold mr-3">
                {newUsername.charAt(0)}
              </div>
              <textarea
                className="post-namearea"
                rows={1}
                placeholder="ユーザー名"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                maxLength={30} // ユーザー名の最大文字数を制限
              />
            </div>
            <div className="post-middlearea">
              <textarea
                className="post-explanation-area"
                rows={3}
                placeholder="あなたのアイデアを教えて!!  (100文字以内)"
                maxLength={100} // アイデア内容の最大文字数を100文字に制限
                value={newIdeaContent}
                onChange={(e) => setNewIdeaContent(e.target.value)}
              />
              <div className='count-area'>
                {newIdeaContent.length}/100
              </div>
              {/* description表示切り替えボタン */}
              <button
                type="button"
                className="post-toggle-button"
                onClick={() => setShowDescription(!showDescription)}
              >
                {showDescription ? '詳細を隠す' : '詳細を追加'}
              </button>
              
              {/* 条件付きでdescription-areaを表示 */}
              {showDescription && (
                <div className="description-container">
                  <textarea
                    className="post-deacription-area"
                    rows={3}
                    placeholder="詳細な説明も入力してみよう (2000文字以内)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    maxLength={2000}
                  />
                  <div className={`character-count ${newDescription.length > 1800 ? 'warning' : ''}`}>
                    {newDescription.length}/2000
                  </div>
                </div>
              )}

              {/* エラーメッセージ表示 */}
              {error && (
                <div className="error-message-area">
                  {error}
                </div>
              )}

            </div>
            <div className="post-buttonarea">
              <button
                type="submit"
                className="post-submit-button"
              >
                ツイート
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Post;
